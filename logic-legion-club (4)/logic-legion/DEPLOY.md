# 🚀 Logic Legion Club — Deployment Guide
## Render (Server) + MongoDB Atlas (Database)

---

## STEP 1 — Set Up MongoDB Atlas

1. Go to https://cloud.mongodb.com and create a free account.
2. Click **"Build a Database"** → choose **FREE (M0 tier)** → pick any cloud region → click **Create**.
3. Under **Security > Database Access** → Add a new user:
   - Username: `logiclegion`
   - Password: Create a strong password (save it!)
   - Role: **Atlas Admin**
4. Under **Security > Network Access** → Click **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)
5. Go back to **Database** → click **Connect** → **Drivers** → Copy your connection string:
   ```
   mongodb+srv://logiclegion:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password, and add the DB name:
   ```
   mongodb+srv://logiclegion:YOURPASSWORD@cluster0.xxxxx.mongodb.net/logiclegion?retryWrites=true&w=majority
   ```
   ✅ Save this — you'll need it in Step 3.

---

## STEP 2 — Push Code to GitHub

1. Create a new repository on https://github.com (name it `logic-legion-club`)
2. In your project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/logic-legion-club.git
   git push -u origin main
   ```
3. ⚠️ Make sure `.env` is in `.gitignore` — NEVER push your real credentials to GitHub!

---

## STEP 3 — Deploy on Render

1. Go to https://render.com and sign up (free).
2. Click **New +** → **Web Service**
3. Connect your GitHub account → Select your `logic-legion-club` repository
4. Fill in the settings:
   | Field | Value |
   |-------|-------|
   | Name | `logic-legion-club` |
   | Region | Pick closest to India (Singapore) |
   | Branch | `main` |
   | Runtime | **Node** |
   | Build Command | `npm install` |
   | Start Command | `node server.js` |
   | Instance Type | **Free** |

5. Click **Environment Variables** → Add these:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | your full MongoDB Atlas connection string |
   | `ADMIN_PASSWORD` | `LLC@2026` |
   | `PORT` | `3000` |

6. Click **Create Web Service** — Render will build and deploy it!
7. After ~2 minutes, you'll get a URL like: `https://logic-legion-club.onrender.com`

---

## STEP 4 — Test Your App

- 🌐 **Registration page**: `https://logic-legion-club.onrender.com`
- 🔐 **Admin dashboard**: Click the "Admin Dashboard" button → enter password `LLC@2026`
- ✅ Submit a test registration and verify it shows in the admin panel

---

## ⚠️ Important Notes

- **Free Render servers sleep after 15 minutes of inactivity** — the first request after sleeping takes ~30 seconds. Upgrade to paid ($7/mo) to avoid this.
- **Never share your MONGODB_URI or change the admin password in public** — change it in Render's Environment Variables panel.
- To change the admin password: Go to Render → Your Service → Environment → Update `ADMIN_PASSWORD` → Save (service will redeploy automatically).

---

## 📁 Project Structure
```
logic-legion-club/
├── server.js          ← Express backend + API routes
├── package.json       ← Dependencies
├── .env.example       ← Template for environment variables
├── .gitignore         ← Excludes .env and node_modules
└── public/
    └── index.html     ← Complete frontend (registration + admin)
```

---

**Built for Logic Legion Club | LLC@2026**
