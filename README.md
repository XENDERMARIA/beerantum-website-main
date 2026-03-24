# 🔬 Beerantum — Full-Stack Quantum Computing Website

A complete **full-stack** web application for the Beerantum quantum computing team.

---

## 📁 PROJECT STRUCTURE

```
beerantum-fullstack/
│
├── 📂 frontend/                    ← React + Vite + TypeScript
│   ├── public/
│   │   └── images/                ← 🖼️  Place your JPG images here (see Image Guide below)
│   ├── src/
│   │   ├── assets/images/         ← 🖼️  Or here for bundled assets
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx     ← Top navigation bar
│   │   │   │   └── Footer.tsx     ← Site footer
│   │   │   └── admin/
│   │   │       └── AdminLayout.tsx ← Admin sidebar + header
│   │   ├── pages/
│   │   │   ├── HomePage.tsx       ← All public landing page sections
│   │   │   ├── LoginPage.tsx      ← Admin login page
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AdminTeamPage.tsx
│   │   │       ├── AdminEventsPage.tsx
│   │   │       ├── AdminPartnersPage.tsx
│   │   │       ├── AdminContactsPage.tsx
│   │   │       └── AdminContentPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts             ← Axios instance + token refresh interceptor
│   │   │   └── index.ts           ← All API service functions
│   │   ├── store/
│   │   │   └── authStore.ts       ← Zustand store (auth state + localStorage)
│   │   ├── types/
│   │   │   └── index.ts           ← All TypeScript interfaces
│   │   ├── utils/
│   │   │   └── index.ts           ← Helper functions (cn, formatDate, etc.)
│   │   ├── styles/
│   │   │   └── globals.css        ← Global CSS + Tailwind + custom utilities
│   │   ├── App.tsx                ← Router setup + protected routes
│   │   └── main.tsx               ← React entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── .env.example
│
├── 📂 backend/                     ← Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        ← MongoDB connection
│   │   │   └── jwt.js             ← JWT sign/verify helpers
│   │   ├── controllers/           ← Business logic (one per resource)
│   │   │   ├── auth.controller.js
│   │   │   ├── team.controller.js
│   │   │   ├── events.controller.js
│   │   │   ├── partners.controller.js
│   │   │   ├── contact.controller.js
│   │   │   └── content.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js  ← protect() + restrictTo() + optionalAuth()
│   │   │   └── validate.middleware.js ← Express-validator error handler
│   │   ├── models/                ← Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── TeamMember.js
│   │   │   ├── Event.js
│   │   │   ├── Partner.js
│   │   │   ├── Contact.js
│   │   │   └── Content.js
│   │   ├── routes/                ← Express routers
│   │   │   ├── auth.routes.js
│   │   │   ├── team.routes.js
│   │   │   ├── events.routes.js
│   │   │   ├── partners.routes.js
│   │   │   ├── contact.routes.js
│   │   │   └── content.routes.js
│   │   ├── utils/
│   │   │   └── seeder.js          ← Database seed script
│   │   ├── app.js                 ← Express app + middleware + routes
│   │   └── server.js              ← Entry: DB connect + start server
│   ├── package.json
│   └── .env.example
│
└── README.md                       ← You're reading it!
```

---

## 🖼️ IMAGE PLACEMENT GUIDE

When you download images, place them in these **exact** locations:

| Image | File Name | Location |
|-------|-----------|----------|
| Hero background or mascot | `hero-bg.jpg` | `frontend/public/images/hero-bg.jpg` |
| Quantum atom / logo visual | `quantum-atom.png` | `frontend/public/images/quantum-atom.png` |
| Team member 1 photo | `team-aria.jpg` | `frontend/public/images/team/team-aria.jpg` |
| Team member 2 photo | `team-zara.jpg` | `frontend/public/images/team/team-zara.jpg` |
| Team member 3 photo | `team-marcus.jpg` | `frontend/public/images/team/team-marcus.jpg` |
| Team member 4 photo | `team-leila.jpg` | `frontend/public/images/team/team-leila.jpg` |
| Team member 5 photo | `team-dmitri.jpg` | `frontend/public/images/team/team-dmitri.jpg` |
| Team member 6 photo | `team-sofia.jpg` | `frontend/public/images/team/team-sofia.jpg` |
| Event 1 image | `event-hackathon.jpg` | `frontend/public/images/events/event-hackathon.jpg` |
| Event 2 image | `event-workshop.jpg` | `frontend/public/images/events/event-workshop.jpg` |
| IBM logo | `logo-ibm.png` | `frontend/public/images/partners/logo-ibm.png` |
| Qiskit logo | `logo-qiskit.png` | `frontend/public/images/partners/logo-qiskit.png` |
| Microsoft logo | `logo-microsoft.png` | `frontend/public/images/partners/logo-microsoft.png` |

### Using images in your code:
```tsx
// In JSX — images in /public are accessible directly:
<img src="/images/team/team-aria.jpg" alt="Aria Quantum" />

// Or via admin panel — just enter the URL:
// photoUrl = "/images/team/team-aria.jpg"
```

---

## 🚀 SETUP — STEP BY STEP

### STEP 1: Prerequisites
Make sure you have installed:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
  - OR use **MongoDB Atlas** (free cloud) → https://cloud.mongodb.com

---

### STEP 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env

# Edit .env with your values:
# MONGODB_URI=mongodb://localhost:27017/beerantum
# JWT_SECRET=your_long_random_secret_here_min_32_chars
# FRONTEND_URL=http://localhost:5173
```

---

### STEP 3: Seed the Database (create admin user + sample data)

```bash
# Still in /backend
npm run seed
```

This creates:
- ✅ Admin user: `admin@beerantum.com` / `Admin@123456`
- ✅ 6 sample team members
- ✅ 3 sample events (2 upcoming, 1 past)
- ✅ 3 partners (IBM, Qiskit, Microsoft)
- ✅ Default site content

---

### STEP 4: Start the Backend

```bash
# Development mode (auto-restart on file changes)
npm run dev

# OR production
npm start
```

Backend runs on: `http://localhost:5000`
Test it: `http://localhost:5000/api/health`

---

### STEP 5: Setup Frontend

```bash
# Open a NEW terminal
cd frontend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# .env content: VITE_API_URL=http://localhost:5000/api
```

---

### STEP 6: Start the Frontend

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔗 HOW THEY CONNECT

```
Browser (React) → HTTP request → Express API → MongoDB
         ↑                              |
         └──── JSON response ←──────────┘
```

1. **Frontend → Backend**: Vite is configured to proxy `/api/*` to `http://localhost:5000`
   - In production, set `VITE_API_URL` to your actual backend URL
2. **Backend → MongoDB**: Uses Mongoose. Connection string in `.env` as `MONGODB_URI`
3. **Auth flow**:
   - Login → backend returns `accessToken` (15min) + `refreshToken` (7 days)
   - Tokens stored in `localStorage` via Zustand persist
   - Axios interceptor auto-refreshes the access token when it expires

---

## 🔐 AUTHENTICATION

| Route | Access Level |
|-------|-------------|
| `GET /api/team` | Public (anyone) |
| `POST /api/contact` | Public (anyone) |
| `GET /api/events` | Public (anyone) |
| `POST/PUT /api/team` | Admin + Editor |
| `POST/PUT /api/events` | Admin + Editor |
| `DELETE /api/team/:id` | Admin only |
| `POST /api/auth/register` | Admin only |

### User roles:
- **admin** — full access (create users, delete anything)
- **editor** — can add/edit, cannot delete or manage users

---

## 🗄️ DATABASE COLLECTIONS

| Collection | Purpose |
|-----------|---------|
| `users` | Admin and editor accounts |
| `teammembers` | Team member profiles |
| `events` | Events (hackathons, workshops) |
| `partners` | Partners and sponsors |
| `contacts` | Contact form submissions |
| `contents` | Editable site text content |

---

## 🌐 URLS

| URL | Description |
|-----|-------------|
| `http://localhost:5173/` | Public website |
| `http://localhost:5173/login` | Admin login |
| `http://localhost:5173/admin` | Admin dashboard |
| `http://localhost:5173/admin/team` | Manage team |
| `http://localhost:5173/admin/events` | Manage events |
| `http://localhost:5173/admin/partners` | Manage partners |
| `http://localhost:5173/admin/contacts` | View messages |
| `http://localhost:5173/admin/content` | Edit site text |
| `http://localhost:5000/api/health` | Backend health check |

---

## 📦 PRODUCTION DEPLOYMENT

```bash
# Build frontend
cd frontend
npm run build
# Output in /frontend/dist — deploy to Vercel / Netlify / S3

# Backend — deploy to Railway / Render / DigitalOcean
# Set environment variables in your hosting dashboard
# Use MongoDB Atlas for production database
```

---

## 🔧 COMMON ISSUES

**MongoDB connection refused?**
→ Make sure MongoDB is running: `mongod` (local) or use Atlas

**CORS error in browser?**
→ Check `FRONTEND_URL` in backend `.env` matches your frontend URL exactly

**Token expired errors?**
→ The app auto-refreshes tokens. If logout loop occurs, clear localStorage and login again

**Seed fails?**
→ Check your `MONGODB_URI` in backend `.env` is correct

---

© 2026 Beerantum Team
