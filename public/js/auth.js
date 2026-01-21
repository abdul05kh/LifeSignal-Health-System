// --- 1. PAGE PROTECTION ---
// Only run this check if we are on a "Protected" page
const path = window.location.pathname;
const protectedPages = ['/dashboard', '/assessment', '/history', '/report.html', '/admin'];

if (protectedPages.some(page => path.includes(page))) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn("No token found. Redirecting to Login.");
        window.location.href = '/login';
    }
}

// --- 2. LOGIN FUNCTION ---
async function login() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const btn = document.querySelector('button');
    const msg = document.getElementById('error-msg');

    if(!u || !p) {
        if(msg) { msg.innerText = "Please enter username and password"; msg.style.color = "red"; }
        return;
    }

    btn.disabled = true;
    btn.innerText = "Verifying...";

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();

        if(data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', data.username);
            
            if(msg) { msg.innerText = "Success! Redirecting..."; msg.style.color = "green"; }
            
            setTimeout(() => {
                if(data.role === 'admin') window.location.href = '/admin';
                else window.location.href = '/dashboard';
            }, 500);
        } else {
            if(msg) msg.innerText = data.message;
            btn.disabled = false;
            btn.innerText = "Access Dashboard";
        }
    } catch (err) {
        console.error(err);
        if(msg) msg.innerText = "Server Error";
        btn.disabled = false;
        btn.innerText = "Access Dashboard";
    }
}

// --- 3. LOGOUT FUNCTION ---
function logout() {
    localStorage.clear();
    window.location.href = '/login';
}

// --- 4. USERNAME DISPLAY ---
const userDisplay = document.getElementById('user-display');
if(userDisplay) {
    userDisplay.innerText = localStorage.getItem('user') || 'Student';
}