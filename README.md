# Cambridge Little Kids 🎓

A full-stack mobile application for managing students, fees, and school operations at **Cambridge Kids pre School**. Built with React Native (Expo) for the frontend and Node.js/Express for the backend, with support for both MongoDB and PostgreSQL databases.

---

## 📱 Features

- **Authentication** — Secure JWT-based login with role-based access (`admin` / `staff`) and a "Remember Me" option using Expo SecureStore
- **Dashboard** — At-a-glance stats: total students, total fees collected, and monthly fee collection
- **Student Management** — Add, view, edit, and delete student records including name, grade, parent names, and contact number
- **Fee Management** — Search students by name, record fee payments, and track outstanding balances
- **User Management** — Admin-only screen to manage staff accounts
- **Responsive UI** — Scales gracefully across different screen sizes using custom responsive utilities

---

## 🗂️ Project Structure

```
Service_learning_project_2/
├── app/                        # Expo Router screens & components
│   ├── (tabs)/                 # Tab navigation layout
│   ├── LoginScreen.tsx
│   ├── DashboardScreenContainer.tsx
│   ├── DashboardStatsContent.tsx
│   ├── FeeManagementContent.tsx
│   ├── StudentManagementContent.tsx
│   ├── UserManagementContent.tsx
│   └── ...
├── backend/                    # Node.js + Express + MongoDB backend
│   └── src/
│       ├── config/db.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/             # Mongoose models (User, Student, Fee)
│       ├── routes/
│       └── server.js
├── server/                     # Alternative Node.js + Express + PostgreSQL backend
│   └── src/
│       ├── config/db.js
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── server.js
├── components/                 # Reusable UI components
├── constants/                  # API config, theme
├── hooks/                      # Custom React hooks
├── lib/api.ts                  # Centralized API client
└── utils/responsive.ts         # Responsive scaling utilities
```

---

## 🛠️ Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Mobile    | React Native 0.81, Expo ~54, Expo Router        |
| Language  | TypeScript                                      |
| Navigation| React Navigation (Bottom Tabs)                  |
| Storage   | Expo SecureStore (tokens), Expo Linking         |
| Backend   | Node.js, Express 5                              |
| Database  | MongoDB (Mongoose) **or** PostgreSQL            |
| Auth      | JSON Web Tokens (JWT), bcryptjs                 |
| Dev Tools | nodemon, ESLint, TypeScript                     |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- MongoDB Atlas / local MongoDB instance **or** PostgreSQL database

---

### 1. Clone the Repository

```bash
git clone https://github.com/surendrakumars/Service_learning_project_2.git
cd Service_learning_project_2
```

---

### 2. Backend Setup

Choose **one** of the two backends:

#### Option A — MongoDB Backend (`/backend`)

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cambridge_kids
JWT_SECRET=your_jwt_secret_here
```

Start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Seed initial data
npm run seed
```

#### Option B — PostgreSQL Backend (`/server`)

```bash
cd server
npm install
```

Create a `.env` file based on `.env.example`:

```env
PORT=3001
# Add your PostgreSQL connection details here
```

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3001`.

---

### 3. Frontend Setup

From the project root:

```bash
npm install
```

Create a `.env` file (or set environment variables):

```env
EXPO_PUBLIC_API_BASE_URL=http://<your-server-ip>:3001
EXPO_PUBLIC_API_HOST=<your-server-ip>
EXPO_PUBLIC_API_PORT=3001
```

> **Note:** On Android emulators, the app defaults to `10.0.2.2` to reach localhost on the host machine.

Start the Expo development server:

```bash
npm start          # Opens Expo DevTools
npm run android    # Launch on Android emulator/device
npm run ios        # Launch on iOS simulator (macOS only)
npm run web        # Run in browser
```

---

## 🔗 API Endpoints

| Method | Endpoint                       | Description                        | Auth Required |
|--------|--------------------------------|------------------------------------|---------------|
| POST   | `/api/auth/login`              | Login and receive JWT token        | No            |
| GET    | `/api/dashboard/stats`         | Get total students and fee stats   | Yes           |
| GET    | `/api/students`                | List all students (supports `?search=name`) | Yes  |
| POST   | `/api/students`                | Add a new student                  | Yes           |
| GET    | `/api/students/:id`            | Get a student by ID                | Yes           |
| PATCH  | `/api/students/:id`            | Update student details             | Yes           |
| DELETE | `/api/students/:id`            | Delete a student                   | Yes           |
| GET    | `/api/fees/search?name=...`    | Search fee records by student name | Yes           |
| GET    | `/api/fees/:studentId`         | Get fee record for a student       | Yes           |
| PATCH  | `/api/fees/:studentId`         | Update fee payment for a student   | Yes           |
| GET    | `/api/health`                  | Health check                       | No            |

---

## 👤 User Roles

| Role    | Permissions                                                |
|---------|------------------------------------------------------------|
| `admin` | Full access — students, fees, users, dashboard             |
| `staff` | Access to students, fees, and dashboard (no user management)|

---

## 🗄️ Data Models

### Student

| Field         | Type    | Description                   |
|---------------|---------|-------------------------------|
| `name`        | String  | Student's full name           |
| `grade`       | String  | Grade / class                 |
| `father_name` | String  | Father's name                 |
| `mother_name` | String  | Mother's name                 |
| `mobile_no`   | String  | Contact number                |
| `fees_paid`   | Number  | Total fees paid (default: 0)  |

### User

| Field      | Type   | Description                    |
|------------|--------|--------------------------------|
| `name`     | String | Full name                      |
| `email`    | String | Unique login email             |
| `password_hash` | String | Bcrypt-hashed password    |
| `role`     | String | `admin` or `staff`             |

---

## 📸 Screens

- **Login Screen** — Email/password login with Remember Me toggle
- **Dashboard** — Summary cards for student count and fee totals
- **Student Management** — Full CRUD for student records
- **Fee Management** — Search students and record payments
- **User Management** — Admin-only: manage staff accounts
- **Sign Out** — Clear session and return to login

---

## 🧪 Development Scripts

| Command                | Description                             |
|------------------------|-----------------------------------------|
| `npm start`            | Start the Expo dev server               |
| `npm run android`      | Run on Android                          |
| `npm run ios`          | Run on iOS                              |
| `npm run web`          | Run in browser                          |
| `npm run lint`         | Lint the codebase                       |
| `npm run reset-project`| Reset Expo project to a clean state     |
| `cd backend && npm run dev`  | Start backend with hot reload     |
| `cd backend && npm run seed` | Seed initial data into the DB     |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project was developed as part of a **Service Learning** initiative. All rights reserved to the contributors.
