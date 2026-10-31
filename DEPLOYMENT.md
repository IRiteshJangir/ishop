# SWOO TECH MART / ISHOP - Professional Production Hosting & Deployment Guide

This guide details how to launch the complete full-stack e-commerce application (Next.js 14 Frontend + Node.js/Express Backend + MongoDB Cloud Database) to live production hosting.

---

## 🏗️ Architecture Overview

- **Frontend:** Next.js 14 App Router, Tailwind CSS, Lucide Icons (Deployable on **Vercel** or **Netlify**)
- **Backend:** Node.js, Express.js REST API, JWT Authentication, Multer, Helmet, CORS (Deployable on **Render**, **Railway**, or **VPS**)
- **Database:** MongoDB Atlas (Managed Cloud Cluster) or Self-Hosted MongoDB

---

## 🗄️ Step 1: Set Up Cloud Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new **Free Shared Cluster (M0)**.
3. Under **Security > Database Access**:
   - Create a database user (e.g. `ishop_admin`) with a secure password.
4. Under **Security > Network Access**:
   - Click **Add IP Address** -> Select **Allow Access from Anywhere (`0.0.0.0/0`)** so your hosting server can connect.
5. Under **Deployment > Database**:
   - Click **Connect** -> Choose **Drivers** (Node.js).
   - Copy your connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ISHOP?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your real credentials.

---

## 🚀 Step 2: Deploy Backend (Render / Railway / VPS)

### Option A: Deploy on [Render.com](https://render.com) (Recommended Free/Low Cost)
1. Push your repository to GitHub or GitLab.
2. On Render Dashboard, click **New + > Web Service**.
3. Connect your repository.
4. Configure service settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` (or let Render set default) |
   | `MONGODB_URI` | `mongodb+srv://<user>:<pass>@cluster0.mongodb.net/ISHOP?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `your_super_strong_random_secret_2026_xyz` |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` (or `*`) |
6. Click **Deploy Web Service**.
7. Once deployed, note your backend URL: e.g., `https://ishop-backend-api.onrender.com`.
8. Verify health check by opening: `https://ishop-backend-api.onrender.com/api/health`.

### Seeding Initial Products & Admin on Cloud Database:
You can run the seeder once from your terminal to populate your MongoDB Atlas database:
```bash
cd backend
MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0.mongodb.net/ISHOP?retryWrites=true&w=majority" npm run seed
```
This populates:
- 12 verified electronic catalog products
- 7 categories, 10 colors, 8 brands
- Admin account: `admin@ishop.com` / `adminpassword123`
- Demo user: `swoo@gmail.com` / `password123`

---

## 🌐 Step 3: Deploy Frontend (Vercel)

Next.js 14 App Router is natively optimized for **Vercel**.

1. Go to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `frontend`
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://ishop-backend-api.onrender.com` (Your live backend URL) |
5. Click **Deploy**.
6. Vercel will build and launch your site with free SSL: `https://your-shop.vercel.app`.

---

## 🔒 Step 4: Administrator Portal Security

- The customer-facing storefront is 100% separated from the admin panel. There are no admin buttons or links anywhere on the user storefront.
- To access the admin dashboard:
  - Visit: `https://your-shop.vercel.app/admin/login`
  - Default Admin Email: `admin@ishop.com`
  - Default Admin Password: `adminpassword123`
- The admin portal includes protected route guards and JWT verification for all catalog management, categories, colors, brands, products, orders, and user management.
- For production safety, change the admin password in the database or via the admin profile.

---

## 💻 Local Development Instructions

To run both frontend and backend locally on your computer:

### Terminal 1: Backend
```bash
cd backend
npm install
npm run seed     # (Runs once to seed local MongoDB)
npm run dev      # Server running on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev      # Storefront running on http://localhost:3000
```
