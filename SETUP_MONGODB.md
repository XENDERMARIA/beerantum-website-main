# 🗄️ Database Setup Guide — MongoDB

## Why is there "no database"?
The database code is complete, but MongoDB needs to be **installed and running** on your machine. Follow these steps.

---

## OPTION A — Local MongoDB (Recommended for development)

### Step 1: Install MongoDB Community Edition
- **Windows**: https://www.mongodb.com/try/download/community → Download & install `.msi`
- **macOS**: `brew tap mongodb/brew && brew install mongodb-community`
- **Ubuntu/Linux**: `sudo apt-get install -y mongodb`

### Step 2: Start MongoDB
**Windows** (MongoDB installs as a service — usually auto-starts):
```
# Open Services → Start "MongoDB Server"
# OR in PowerShell (admin):
net start MongoDB
```

**macOS**:
```bash
brew services start mongodb-community
```

**Linux**:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # auto-start on boot
```

### Step 3: Verify MongoDB is running
```bash
# Should say "waiting for connections on port 27017"
mongod --version
```

OR open MongoDB Compass (free GUI): https://www.mongodb.com/products/compass

---

## OPTION B — MongoDB Atlas (Free cloud, no install needed)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a free cluster (M0 tier)
3. Click **Connect** → **Connect your application**
4. Copy the connection string:
   ```
   mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/beerantum
   ```
5. Open `backend/.env` and replace:
   ```
   MONGODB_URI=mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/beerantum
   ```
6. In Atlas → Network Access → Add IP: `0.0.0.0/0` (allow all, for dev)

---

## STEP 4: Run the backend (after MongoDB is running)

```bash
cd backend
npm install
npm run seed    # Creates admin user + sample data
npm run dev     # Starts API on http://localhost:5000
```

**Expected output:**
```
✅ MongoDB connected: localhost
🚀 Beerantum API running on port 5000
```

**Test it:**
Open http://localhost:5000/api/health in your browser — you should see:
```json
{"success": true, "message": "Beerantum API is running"}
```

---

## STEP 5: Run the frontend

```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

---

## Admin Login
After seeding:
- URL: http://localhost:5173/login
- Email: `admin@beerantum.com`
- Password: `Admin@123456`

---

## What gets saved to MongoDB?

| Collection | What it stores |
|-----------|----------------|
| `users` | Admin/editor accounts |
| `teammembers` | Team member profiles |
| `events` | Hackathons, workshops etc. |
| `partners` | Partners & sponsors |
| `contacts` | Contact form submissions ← anyone can submit |
| `contents` | Editable site text |

Every form submission, team member added, event created — all saved permanently in MongoDB.

---

## Common Errors

**"MongoServerError: connect ECONNREFUSED 127.0.0.1:27017"**
→ MongoDB is not running. Start it with `brew services start mongodb-community` (Mac) or start the service on Windows.

**"MongooseError: The `uri` parameter must be a string"**
→ `.env` file is missing. Copy from `.env.example` → `.env`

**CORS error in browser**
→ Make sure `FRONTEND_URL=http://localhost:5173` in `backend/.env` matches exactly.
