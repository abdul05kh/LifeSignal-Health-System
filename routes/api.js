const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();

// --- MIDDLEWARE ---
function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ success: false, message: 'No token' });
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) return res.status(403).json({ success: false });
        req.user = user;
        next();
    });
}

// --- AI GENERATOR (Logic stays same) ---
function generateAIReport(data, bmi) {
    let score = 100;
    let diagnosis = [];
    let risks = [];
    let actionPlan = [];

    // Sleep
    if (data.sleep < 5) { score -= 25; diagnosis.push("🔴 **Severe Sleep Deprivation**"); risks.push("High cortisol & memory loss."); actionPlan.push("🌙 No screens after 10 PM."); }
    else if (data.sleep < 7) { score -= 10; diagnosis.push("🟠 **Sleep Debt**"); actionPlan.push("☕ No caffeine after 2 PM."); }
    else { diagnosis.push("🟢 **Optimal Sleep**"); }

    // Stress
    if (data.stress > 8) { score -= 20; diagnosis.push("🔴 **Cortisol Overload**"); risks.push("Burnout risk."); actionPlan.push("🧘 Box breathing exercises."); }
    else if (data.stress > 5) { score -= 10; diagnosis.push("🟠 **Elevated Tension**"); actionPlan.push("🌲 15min nature walk."); }

    // BMI & Activity
    if (bmi > 25) { diagnosis.push(`⚠️ **BMI Warning (${bmi})**`); actionPlan.push("🏃 Increase daily steps."); }
    if (data.screen_time > 8) { score -= 15; diagnosis.push("🔴 **Digital Sedentarism**"); actionPlan.push("👀 20-20-20 Eye Rule."); }

    score = Math.max(0, score);

    return `### 📊 Lifestyle Score: ${score}/100\n\n#### 🩺 Diagnosis\n${diagnosis.join('\n')}\n\n#### ⚠️ Risks\n${risks.length ? risks.join('\n') : "None detected."}\n\n#### 🚀 Action Plan\n${actionPlan.join('\n')}`;
}

// --- ROUTES ---

// 1. Log Data
router.post('/log', authenticate, async (req, res) => {
    const { sleep, activity, diet, stress, height, weight, water, screen_time, mood } = req.body;
    const user_id = req.user.id;
    const bmi = (weight / ((height/100)**2)).toFixed(1);

    // Risk Calc
    let riskScore = 0;
    if (sleep < 6) riskScore += 2;
    if (stress > 7) riskScore += 2;
    if (bmi > 25) riskScore += 1;
    let riskLevel = riskScore >= 5 ? "High Risk" : (riskScore >= 3 ? "Moderate Risk" : "Low Risk");
    let aiReport = generateAIReport(req.body, bmi);

    try {
        await db.query(
            `INSERT INTO daily_logs (user_id, sleep, activity, diet_score, stress, bmi, water, screen_time, mood, risk_level, ai_report) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [user_id, sleep, activity, diet, stress, bmi, water, screen_time, mood, riskLevel, aiReport]
        );
        res.json({ success: true, riskLevel, aiReport, bmi });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "DB Error" });
    }
});

// 2. Dashboard Stats
router.get('/stats', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Run queries in parallel
        const lastLog = await db.query("SELECT * FROM daily_logs WHERE user_id = $1 ORDER BY date DESC LIMIT 1", [userId]);
        const avgs = await db.query("SELECT AVG(sleep) as avg_sleep FROM daily_logs WHERE user_id = $1", [userId]);
        const history = await db.query("SELECT date, risk_level, sleep, stress FROM daily_logs WHERE user_id = $1 ORDER BY date ASC LIMIT 7", [userId]);

        res.json({
            currentStatus: lastLog.rows[0] ? lastLog.rows[0].risk_level : "No Data",
            currentBMI: lastLog.rows[0] ? lastLog.rows[0].bmi : "--",
            avgSleep: avgs.rows[0].avg_sleep ? parseFloat(avgs.rows[0].avg_sleep).toFixed(1) : "-",
            history: history.rows || []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Stats failed" });
    }
});

// 3. Full History
router.get('/history', authenticate, async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM daily_logs WHERE user_id = $1 ORDER BY date DESC", [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// 4. Admin Stats
router.get('/admin/stats', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
        const users = await db.query("SELECT COUNT(*) as count FROM users WHERE role='student'");
        const risks = await db.query("SELECT risk_level, COUNT(*) as count FROM daily_logs GROUP BY risk_level");
        const logs = await db.query("SELECT u.username, d.* FROM daily_logs d JOIN users u ON d.user_id = u.id ORDER BY d.date DESC LIMIT 50");

        res.json({
            totalStudents: users.rows[0].count,
            riskDistribution: risks.rows,
            recentLogs: logs.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({});
    }
});

module.exports = router;