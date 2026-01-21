const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to the Cloud Database using the URL from .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

// Test the connection immediately
pool.connect((err, client, release) => {
    if (err) {
        console.error("❌ Cloud Connection Failed:", err.message);
    } else {
        console.log("✅ Connected to Cloud Database (PostgreSQL)");
        release();
    }
});

// Create Tables Automatically
const createTables = async () => {
    try {
        // 1. Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                age INTEGER,
                gender TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Logs Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS daily_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                sleep REAL,
                activity INTEGER,
                diet_score INTEGER,
                stress INTEGER,
                bmi REAL,
                water INTEGER,
                screen_time REAL,
                mood TEXT,
                risk_level TEXT,
                risk_factors TEXT,
                ai_report TEXT
            );
        `);

        // 3. Create Default Admin
        const adminCheck = await pool.query("SELECT * FROM users WHERE username = $1", ['admin']);
        if (adminCheck.rows.length === 0) {
            const hash = await bcrypt.hash("admin123", 10);
            await pool.query(
                "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
                ['admin', 'admin@college.edu', hash, 'admin']
            );
            console.log("✅ Admin Account Created");
        }

    } catch (err) {
        console.error("Error creating tables:", err);
    }
};

createTables();

module.exports = pool;