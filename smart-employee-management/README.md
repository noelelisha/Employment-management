# Smart Employee Management and Workplace Learning System

A MERN-stack mini project for employee administration, onboarding, workplace learning, project tracking, and new-recruit confidence building.

## Technology
- Frontend: React + Vite, React Router, Axios, Bootstrap
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT, bcryptjs, HTTP-only cookies

## Repository structure
```text
smart-employee-management/
├── client/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env.example
└── README.md
```

## Setup

### 1. Requirements
Install Node.js (LTS) and MongoDB, or create a MongoDB Atlas database.

### 2. Install dependencies
From the repository root:

```bash
cd server
npm install
cp .env.example .env
```

Update `server/.env` with your MongoDB connection string and a long random JWT secret.

Then:

```bash
cd ../client
npm install
```

### 3. Run the application
Open two terminals.

Terminal 1:
```bash
cd server
npm run dev
```

Terminal 2:
```bash
cd client
npm run dev
```

Frontend: http://localhost:5173
Backend health check: http://localhost:5000/api/health

## Core modules planned
- Role-based accounts: Admin, HR, Manager, Employee
- Employee and department management
- Company onboarding and learning resources
- 30-day new-recruit confidence journey
- Department-specific training tasks
- Projects, task assignments, and submissions
- Manager feedback and achievement badges
- Progress dashboards and reports

## Important
This repository is a starter scaffold, not a completed production application. Implement and test each module before using real employee data. Do not commit `.env` files or real credentials.
