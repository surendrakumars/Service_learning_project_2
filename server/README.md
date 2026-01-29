# Cambridge Kids Pre School - Backend API

Node.js/Express backend with PostgreSQL for the Cambridge Kids Pre School mobile app.

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** 14+ (running locally or remote)

## Setup

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Create PostgreSQL database

```sql
CREATE DATABASE cambridge_kids_db;
```

### 3. Configure environment

Copy `.env.example` to `.env` and set your database URL:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=3001
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cambridge_kids_db
```

Or use individual variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cambridge_kids_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 4. Initialize database schema

```bash
npm run init-db
```

This creates the `users` and `students` tables and a default admin user:
- **Email:** admin@cambridgekids.com
- **Password:** admin123

### 5. Start the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

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
