# 🏥 LifeSignal - Health Intelligence System

> **Your Personal AI Health Guardian.** > Monitor sleep, stress, and lifestyle habits to prevent burnout before it happens.

<img width="1895" height="935" alt="Screenshot 2026-01-21 231434" src="https://github.com/user-attachments/assets/5ba86d5a-d699-4fa3-a064-2d57ebf27195" />


## 📖 Overview
**LifeSignal** is a full-stack web application designed to help students and professionals track their physical and mental well-being. By logging daily metrics like sleep, activity, and stress, the system uses an **AI Engine** to calculate risk levels and generate personalized health reports.

Unlike static trackers, LifeSignal provides real-time feedback and alerts users when their lifestyle patterns indicate a high risk of burnout or health issues.

## ✨ Key Features

### 👤 User Features
* **Health Check Assessment:** A daily form to log sleep, water intake, screen time, stress levels, and mood.
* **AI Analysis:** Automatically calculates a **Risk Score** (Low, Moderate, High) and generates actionable advice.
* **Interactive Dashboard:** Visualizes trends using dynamic **Chart.js** graphs.
* **History Log:** View past assessments and track progress over time.
* **Secure Authentication:** Encrypted login/registration system using JWT and Bcrypt.

### 🛡️ Admin Features
* **Centralized Monitoring:** View global stats on student health.
* **Risk Distribution:** A pie chart showing the percentage of students at "High Risk."
* **Student Logs:** Inspect recent entries to identify students needing support.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Glassmorphism), JavaScript (Vanilla), Chart.js
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Hosted on **Supabase**)
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt
* **Deployment:** Ready for Vercel/Render

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
* [Node.js](https://nodejs.org/) (v14 or higher)
* A [Supabase](https://supabase.com/) account (Free tier)

### 1. Clone the Repository
```bash 
git clone [https://github.com/YOUR-USERNAME/LifeSignal-Health-System.git](https://github.com/YOUR-USERNAME/LifeSignal-Health-System.git)
cd LifeSignal-Health-System

### 2. Install Dependencies
Navigate into the project folder and install the required libraries:
```bash
npm install

3. Configure Environment Variables
You must create a secret file to store your database connection.

Create a new file named .env in the root folder.

Paste the following keys inside it:
JWT_SECRET=my_super_secret_key_change_me
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[aws-0-ap-south-1.pooler.supabase.com:6543/postgres](https://aws-0-ap-south-1.pooler.supabase.com:6543/postgres)"
  Important: Replace [YOUR-PASSWORD] with the actual password you set for your Supabase database. Remove the brackets!

4. Run the Server
Start the backend server:
'''bash
node server.js

The server will start at http://localhost:3000.

Note: The application will automatically create the necessary database tables (users and daily_logs) in your Supabase cloud the first time you run it!

🔐 Default Admin Credentials
To access the Admin Panel immediately, use this pre-configured account:

Username: admin

Password: admin123

(Note: This account is created automatically when the server starts for the first time)

🤝 Contributing
Contributions are welcome!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request
