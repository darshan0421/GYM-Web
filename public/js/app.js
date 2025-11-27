const API_URL = '/api';

// --- Navigation ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.remove('hidden');
    document.getElementById(pageId).classList.add('active');

    // Update Nav
    const userId = localStorage.getItem('userId');
    if (userId) {
        document.getElementById('nav-login-btn').style.display = 'none';
        document.getElementById('nav-dashboard-btn').style.display = 'inline-block';
        document.getElementById('nav-logout-btn').style.display = 'inline-block';
    } else {
        document.getElementById('nav-login-btn').style.display = 'inline-block';
        document.getElementById('nav-dashboard-btn').style.display = 'none';
        document.getElementById('nav-logout-btn').style.display = 'none';
    }
}

function switchAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.add('hidden'));

    if (tab === 'login') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('login-form').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('active');
    }
}

// --- Auth ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('userId', data.id);
            localStorage.setItem('username', data.username);
            alert('Login Successful!');
            loadDashboard();
            showPage('dashboard-page');
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Login failed');
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const height = document.getElementById('reg-height').value;
    const weight = document.getElementById('reg-weight').value;
    const goal = document.getElementById('reg-goal').value;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, height, weight, goal })
        });
        const data = await res.json();

        if (res.ok) {
            alert('Registration Successful! Please Login.');
            switchAuthTab('login');
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Registration failed');
    }
});

function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    showPage('landing-page');
}

// --- Dashboard ---
async function loadDashboard() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    document.getElementById('user-name').innerText = localStorage.getItem('username');

    try {
        const res = await fetch(`${API_URL}/daily-plan/${userId}`);
        const data = await res.json();

        if (res.ok) {
            // Stats
            document.getElementById('disp-height').innerText = data.user_stats.height;
            document.getElementById('disp-weight').innerText = data.user_stats.weight;
            document.getElementById('disp-goal').innerText = data.user_stats.goal.replace('_', ' ').toUpperCase();
            document.getElementById('current-day').innerText = data.day;

            // Workout
            const workoutContainer = document.getElementById('workout-content');
            workoutContainer.innerHTML = `<h4>Focus: ${data.workout.focus}</h4>`;
            data.workout.exercises.forEach(ex => {
                workoutContainer.innerHTML += `
                    <div class="workout-item">
                        <h4>${ex.name}</h4>
                        <p>${ex.duration} | ${ex.sets}</p>
                    </div>
                `;
            });

            // Diet
            const dietContainer = document.getElementById('diet-content');
            dietContainer.innerHTML = `<h4>Type: ${data.diet.type}</h4>`;
            dietContainer.innerHTML += `
                <div class="diet-item"><h4>Breakfast</h4><p>${data.diet.breakfast}</p></div>
                <div class="diet-item"><h4>Lunch</h4><p>${data.diet.lunch}</p></div>
                <div class="diet-item"><h4>Dinner</h4><p>${data.diet.dinner}</p></div>
            `;
        }
    } catch (err) {
        console.error(err);
    }
}

// --- Equipment ---
async function loadEquipment() {
    try {
        const res = await fetch(`${API_URL}/equipment`);
        const json = await res.json();

        const container = document.getElementById('equipment-list');
        container.innerHTML = '';

        if (json.data) {
            json.data.forEach(item => {
                container.innerHTML += `
                    <div class="equipment-card">
                        <img src="${item.image_url}" alt="${item.name}" class="equipment-img" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                        <div class="equipment-info">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            <p><strong>Usage:</strong> ${item.usage_instructions}</p>
                        </div>
                    </div>
                `;
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadEquipment();
    if (localStorage.getItem('userId')) {
        loadDashboard();
    }
});
