const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// --- Auth Routes ---

app.post('/api/register', (req, res) => {
    const { username, password, height, weight, goal } = req.body;
    const passwordHash = bcrypt.hashSync(password, 8);

    const sql = `INSERT INTO users (username, password, height, weight, goal) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [username, passwordHash, height, weight, goal], function (err) {
        if (err) {
            return res.status(500).json({ error: 'User registration failed. Username might be taken.' });
        }
        res.status(200).json({ id: this.lastID, message: 'User registered successfully' });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ?`;

    db.get(sql, [username], (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ error: 'Invalid password' });

        res.status(200).json({
            id: user.id,
            username: user.username,
            goal: user.goal,
            height: user.height,
            weight: user.weight
        });
    });
});

// --- Data Routes ---

app.get('/api/equipment', (req, res) => {
    db.all("SELECT * FROM equipment", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.get('/api/daily-plan/:id', (req, res) => {
    const userId = req.params.id;
    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });

        // Simple logic to generate plan based on goal
        let workout = {};
        let diet = {};

        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        if (user.goal === 'weight_loss') {
            workout = {
                focus: 'Cardio & HIIT',
                exercises: [
                    { name: 'Treadmill Run', duration: '20 mins', sets: '1' },
                    { name: 'Burpees', duration: '3 sets of 15 reps', sets: '3' },
                    { name: 'Jump Rope', duration: '10 mins', sets: '1' }
                ]
            };
            diet = {
                type: 'Calorie Deficit',
                breakfast: 'Oatmeal with berries',
                lunch: 'Grilled chicken salad',
                dinner: 'Steamed vegetables with fish'
            };
        } else if (user.goal === 'muscle_gain') {
            workout = {
                focus: 'Strength Training',
                exercises: [
                    { name: 'Bench Press', duration: '4 sets of 8-10 reps', sets: '4' },
                    { name: 'Deadlifts', duration: '3 sets of 5 reps', sets: '3' },
                    { name: 'Dumbbell Curls', duration: '3 sets of 12 reps', sets: '3' }
                ]
            };
            diet = {
                type: 'High Protein',
                breakfast: '3 Eggs & Toast',
                lunch: 'Steak with rice',
                dinner: 'Chicken breast with sweet potato'
            };
        } else {
            // Default/Maintenance
            workout = {
                focus: 'Full Body Tone',
                exercises: [
                    { name: 'Cycling', duration: '30 mins', sets: '1' },
                    { name: 'Pushups', duration: '3 sets of 20', sets: '3' },
                    { name: 'Plank', duration: '3 sets of 1 min', sets: '3' }
                ]
            };
            diet = {
                type: 'Balanced',
                breakfast: 'Yogurt & Granola',
                lunch: 'Turkey Sandwich',
                dinner: 'Pasta with tomato sauce'
            };
        }

        res.json({
            day: today,
            workout,
            diet,
            user_stats: { height: user.height, weight: user.weight, goal: user.goal }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
