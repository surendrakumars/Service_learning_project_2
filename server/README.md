# Cambridge Kids Pre School - Backend API

Node.js/Express backend with **SQLite** for the Cambridge Kids Pre School mobile app. No database installation required.

## Prerequisites

- **Node.js** 18+

## Setup

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Initialize database (creates SQLite file automatically)

```bash
npm run init-db
```

This creates `data/cambridge_kids.db` and a default admin user:
- **Email:** admin@cambridgekids.com
- **Password:** admin123

### 3. Start the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

**Note:** No `.env` file needed for basic setup. The database file is stored in `server/data/`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (email, password) |
| GET | `/api/dashboard/stats` | Dashboard stats (students, fees collected, fees pending) |
| GET | `/api/students` | List all students (?search=name) |
| POST | `/api/students` | Add student |
| GET | `/api/students/:id` | Get student by ID |
| PATCH | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| DELETE | `/api/students/by-name/:name` | Delete student by name |
| GET | `/api/fees/search?name=...` | Search student fees by name |
| GET | `/api/fees/:studentId` | Get fee details |
| PATCH | `/api/fees/:studentId` | Update fees paid |

## Connecting the Expo app

Set the API base URL in your Expo app (e.g. in a config file):

- **Android emulator:** `http://10.0.2.2:3001`
- **iOS simulator:** `http://localhost:3001`
- **Physical device:** `http://YOUR_COMPUTER_IP:3001`
