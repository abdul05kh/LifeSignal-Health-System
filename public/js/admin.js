async function loadAdminData() {
    const token = localStorage.getItem('token');
    if(!token) window.location.href = '/';

// UPDATED FETCH URL TO MATCH ROUTES
    const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': token }
    });
    
    if(res.status === 403) return alert("Access Denied: Admins Only");
    const data = await res.json();

    // 1. Stats
    document.getElementById('total-students').innerText = data.totalStudents;
    
    // 2. Chart
    const risks = { 'Low Risk': 0, 'Moderate Risk': 0, 'High Risk': 0 };
    data.riskDistribution.forEach(r => risks[r.risk_level] = r.count);
    document.getElementById('high-risk-count').innerText = risks['High Risk'];

    new Chart(document.getElementById('adminChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(risks),
            datasets: [{ data: Object.values(risks), backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'] }]
        }
    });

    // 3. Table
    const tbody = document.querySelector('#admin-table tbody');
    data.recentLogs.forEach(log => {
        tbody.innerHTML += `
            <tr>
                <td>${log.username}</td>
                <td>${new Date(log.date).toLocaleDateString()}</td>
                <td><span class="badge ${log.risk_level === 'High Risk' ? 'risk' : 'safe'}">${log.risk_level}</span></td>
                <td>${log.risk_factors || 'None'}</td>
            </tr>`;
    });
}

function exportData() {
    alert("CSV Export Feature - Ready for implementation based on academic requirements.");
}

document.addEventListener('DOMContentLoaded', loadAdminData);