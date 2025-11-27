const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use In-Memory DB for Vercel compatibility
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the In-Memory SQLite database.');
    }
});

db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        height REAL,
        weight REAL,
        goal TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Equipment Table
    db.run(`CREATE TABLE IF NOT EXISTS equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        image_url TEXT,
        usage_instructions TEXT
    )`);

    // Seed Equipment Data
    db.get("SELECT count(*) as count FROM equipment", (err, row) => {
        if (row.count === 0) {
            const equipmentData = [
                {
                    name: 'Smart Treadmill X1',
                    description: 'High-tech treadmill with AI-driven pace adjustment.',
                    image_url: 'assets/treadmill.png',
                    usage_instructions: 'Select your program on the screen, attach the safety clip, and press Start.'
                },
                {
                    name: 'Olympic Bench Press',
                    description: 'Standard Olympic bench for chest development.',
                    image_url: 'assets/benchpress.png',
                    usage_instructions: 'Lie flat, grip the bar slightly wider than shoulder-width, lower to chest, and push up.'
                },
                {
                    name: 'Cable Crossover Machine',
                    description: 'Versatile machine for chest, shoulders, and triceps.',
                    image_url: 'assets/cable_machine.png',
                    usage_instructions: 'Adjust pulleys to desired height, select weight, and pull handles across your body.'
                },
                {
                    name: 'Dumbbell Set (5-50kg)',
                    description: 'Complete set of rubber-coated dumbbells.',
                    image_url: 'assets/dumbbells.png',
                    usage_instructions: 'Pick appropriate weight, maintain good form, and re-rack after use.'
                },
                {
                    name: 'Leg Press Machine',
                    description: 'Heavy-duty machine for targeting quads, hamstrings, and glutes.',
                    image_url: 'assets/leg_press.png',
                    usage_instructions: 'Sit back, place feet shoulder-width apart on the platform, unlock safety bars, and lower the weight slowly.'
                },
                {
                    name: 'Lat Pulldown',
                    description: 'Essential machine for building a wide back and strong lats.',
                    image_url: 'assets/lat_pulldown.png',
                    usage_instructions: 'Adjust knee pads, grip the bar wide, and pull down towards your upper chest while squeezing your back.'
                },
                {
                    name: 'Smith Machine',
                    description: 'Guided barbell system for safe squats, bench press, and more.',
                    image_url: 'assets/smith_machine.png',
                    usage_instructions: 'Load weights, unhook the bar by rotating it, perform your exercise, and rotate back to lock.'
                },
                {
                    name: 'Kettlebell Set',
                    description: 'Cast iron weights for functional strength and cardio.',
                    image_url: 'assets/kettlebells.png',
                    usage_instructions: 'Use for swings, squats, or presses. Keep your core tight and maintain a neutral spine.'
                },
                {
                    name: 'Battle Ropes',
                    description: 'Thick ropes for high-intensity interval training (HIIT).',
                    image_url: 'assets/battle_ropes.png',
                    usage_instructions: 'Grip the ends, stand with knees slightly bent, and create waves by alternating arm movements rapidly.'
                },
                {
                    name: 'Squat Rack',
                    description: 'The centerpiece for heavy compound lifts like squats and overhead press.',
                    image_url: 'assets/squat_rack.png',
                    usage_instructions: 'Set safety pins to appropriate height. Unrack bar across upper back, step back, and squat.'
                },
                {
                    name: 'Leg Extension',
                    description: 'Isolation machine for defining and strengthening the quadriceps.',
                    image_url: 'assets/leg_extension.png',
                    usage_instructions: 'Adjust backrest and shin pad. Extend legs until straight, pause, and lower slowly.'
                },
                {
                    name: 'Seated Cable Row',
                    description: 'Horizontal pulling motion to thicken the middle back.',
                    image_url: 'assets/seated_row.png',
                    usage_instructions: 'Sit with feet on pads, keep back straight, pull handle to torso, and squeeze shoulder blades.'
                },
                {
                    name: 'EZ Curl Bar',
                    description: 'Angled barbell designed to reduce wrist strain during bicep curls.',
                    image_url: 'assets/ez_curl.png',
                    usage_instructions: 'Grip the angled curves, keep elbows tucked by your sides, and curl the weight up.'
                },
                {
                    name: 'Elliptical Trainer',
                    description: 'Low-impact cardio machine that simulates running without joint stress.',
                    image_url: 'assets/elliptical.png',
                    usage_instructions: 'Step onto pedals, grab handles, and move legs in a gliding motion. Adjust resistance as needed.'
                },
                {
                    name: 'Pec Deck Fly',
                    description: 'Isolation machine for chest muscles, great for finishing a workout.',
                    image_url: 'assets/pec_deck.png',
                    usage_instructions: 'Sit with back flat, place forearms on pads, and bring elbows together in front of your chest.'
                },
                {
                    name: 'Dip Station',
                    description: 'Bodyweight station for triceps and chest development.',
                    image_url: 'assets/dip_station.png',
                    usage_instructions: 'Grip bars, lift body, lower yourself until elbows are at 90 degrees, and push back up.'
                },
                {
                    name: 'Medicine Ball',
                    description: 'Weighted balls for core strength and explosive power exercises.',
                    image_url: 'assets/medicine_ball.png',
                    usage_instructions: 'Use for slams, wall throws, or weighted situps. Engage your core throughout the movement.'
                }
            ];

            const stmt = db.prepare("INSERT INTO equipment (name, description, image_url, usage_instructions) VALUES (?, ?, ?, ?)");
            equipmentData.forEach(eq => {
                stmt.run(eq.name, eq.description, eq.image_url, eq.usage_instructions);
            });
            stmt.finalize();
            console.log("Seeded equipment data.");
        }
    });
});

module.exports = db;
