require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API ROUTES ---
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// --- PAGE ROUTES ---
// 1. Homepage (Landing Page)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// 2. Auth Pages
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public/register.html')));

// 3. App Pages (Protected)
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public/dashboard.html')));
app.get('/assessment', (req, res) => res.sendFile(path.join(__dirname, 'public/assessment.html')));
app.get('/history', (req, res) => res.sendFile(path.join(__dirname, 'public/history.html')));
app.get('/report.html', (req, res) => res.sendFile(path.join(__dirname, 'public/report.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public/admin.html')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});