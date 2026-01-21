async function loadDashboard() {
    // 1. Get User Info
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // 2. Update Welcome Message Immediately
    const welcomeEl = document.getElementById('welcome-msg');
    if(welcomeEl) {
        welcomeEl.innerText = "Welcome, " + (user || "Student");
    }

    // 3. Security Check
    if(!token) { window.location.href = '/login'; return; }

    try {
        // 4. Fetch Data from Cloud
        const res = await fetch('/api/stats', {
            headers: { 'Authorization': token }
        });

        // If token is invalid (because of DB switch), force logout
        if(res.status === 401 || res.status === 403) {
            console.warn("Invalid Token. Logging out.");
            logout();
            return;
        }
        
        const data = await res.json();
        
        // 5. Update Cards
        document.getElementById('avg-sleep').innerText = data.avgSleep ? data.avgSleep + 'h' : '--';
        document.getElementById('health-status').innerText = data.currentStatus || "No Data";
        document.getElementById('avg-bmi').innerText = data.currentBMI || "--";

        // 6. Update Activity Table
        const tbody = document.getElementById('recent-table');
        if(tbody) {
            tbody.innerHTML = '';
            const history = data.history || [];

            if(history.length > 0) {
                // Show last 3 entries
                const recent = history.slice(0, 3);
                recent.forEach(row => {
                    let badge = 'safe';
                    if(row.risk_level === 'Moderate Risk') badge = 'warning';
                    if(row.risk_level === 'High Risk') badge = 'risk';

                    tbody.innerHTML += `
                        <tr>
                            <td>${new Date(row.date).toLocaleDateString()}</td>
                            <td><span class="badge ${badge}">${row.risk_level}</span></td>
                        </tr>
                    `;
                });
                // Render Chart
                renderChart(history);
            } else {
                tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; padding:15px; color:var(--text-muted);">No logs yet.<br><a href="/assessment" style="color:var(--accent)">Add your first entry!</a></td></tr>';
            }
        }

    } catch (err) {
        console.error("Dashboard Error:", err);
    }
}

// Chart Rendering Logic
function renderChart(historyData) {
    const canvas = document.getElementById('healthChart');
    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    if(window.myHealthChart) window.myHealthChart.destroy();

    const textColor = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();

    window.myHealthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historyData.map(d => new Date(d.date).toLocaleDateString()),
            datasets: [
                {
                    label: 'Stress',
                    data: historyData.map(d => d.stress),
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Sleep',
                    data: historyData.map(d => d.sleep),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor } } },
            scales: {
                x: { ticks: { color: textColor }, grid: { display: false } },
                y: { ticks: { color: textColor }, min: 0, max: 12 }
            }
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadDashboard);