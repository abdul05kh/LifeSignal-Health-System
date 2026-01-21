const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database'); // This is now the Postgres Pool
const router = express.Router();

// --- REGISTER ---
router.post('/register', async (req, res) => {
    const { username, email, password, age, gender } = req.body;

    try {
        // 1. Check if user exists
        const check = await db.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email]);
        if (check.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Username or Email already taken" });
        }

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert User (Postgres uses 'RETURNING id' to get the new ID)
        await db.query(
            "INSERT INTO users (username, email, password, age, gender) VALUES ($1, $2, $3, $4, $5)",
            [username, email, hashedPassword, age, gender]
        );

        res.json({ success: true, message: "Account created successfully" });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = result.rows[0]; // Postgres returns data in 'rows' array

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({ success: true, token, username: user.username, role: user.role });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;