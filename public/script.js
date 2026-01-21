const API = '/api';

// --- AUTHENTICATION ---
async function login() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: u, password: p})
    });
    const data = await res.json();
    if(data.success) {
        localStorage.setItem('user', u);
        window.location.href = data.redirect; // Redirects to Dashboard or Survey
    } else {
        alert(data.message);
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/';
}

// --- SURVEY ---
async function submitSurvey() {
    const user = localStorage.getItem('user');
    const payload = {
        username: user,
        condition: document.getElementById('condition').value,
        screentime: document.getElementById('screentime').value,
        substance: document.getElementById('substance').value
    };
    await fetch(`${API}/survey`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    window.location.href = '/dashboard';
}

// --- DASHBOARD ---
async function submitDaily() {
    const user = localStorage.getItem('user');
    const payload = {
        username: user,
        sleep: parseFloat(document.getElementById('in-sleep').value),
        stress: parseFloat(document.getElementById('in-stress').value),
        weight: parseFloat(document.getElementById('in-weight').value),
        height: parseFloat(document.getElementById('in-height').value)
    };
    
    const res = await fetch(`${API}/data`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    renderAlerts(data.analysis.alerts);
    loadDashboard(); // Refresh history
}

function renderAlerts(alerts) {
    const box = document.getElementById('alert-box');
    box.innerHTML = '';
    if(alerts.length === 0) box.innerHTML = '<div class="alert success">✨ Optimal Health State</div>';
    alerts.forEach(a => {
        box.innerHTML += `<div class="alert ${a.type}">⚠️ ${a.msg}</div>`;
    });
}

async function loadDashboard() {
    const user = localStorage.getItem('user');
    if(!user) window.location.href = '/';
    
    document.getElementById('welcome-msg').innerText = `Welcome back, ${user}`;
    
    const res = await fetch(`${API}/history/${user}`);
    const data = await res.json();
    
    // Fill History Table
    const tbody = document.getElementById('history-table');
    tbody.innerHTML = '';
    data.history.reverse().slice(0, 7).forEach(row => {
        tbody.innerHTML += `
            <tr>
                <td style="padding:8px">${row.date}</td>
                <td>${row.sleep}h</td>
                <td>${row.stress}/10</td>
                <td style="color:${row.alerts.length > 0 ? '#ff4d4d' : '#00f260'}">
                    ${row.alerts.length > 0 ? 'High Risk' : 'Normal'}
                </td>
            </tr>`;
    });

    // Advanced Insight
    if(data.survey) {
        const insightBox = document.getElementById('survey-insight');
        if(data.survey.screentime > 5) {
            insightBox.innerHTML = `<small style="color:#ffa500">💡 Insight: Your screen time (${data.survey.screentime}h) puts you at risk for digital eye strain. Combine this with your sleep data.</small>`;
        }
    }
}