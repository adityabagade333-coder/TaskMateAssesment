# 📋 TaskMate - MERN Task Management App

A modern **MERN stack** task management application featuring **drag-and-drop workflow**, **user authentication**, and a **responsive UI**.

---

## 🌟 Live Demo & Portfolio

🚀 **Live App:** [TaskMate on Render](https://taskmateassesment-1.onrender.com)  
📂 **Repository:** [GitHub Repo](https://github.com/adityabagade333-coder/TaskMateAssesment.git)  
👨‍💻 **Portfolio:** [aditya.codeclout.in](https://aditya.codeclout.in)

---

## ✨ Features

### 🎨 Frontend (React + Vite + Tailwind)
- 🚀 **Drag & Drop Workflow Board** – 5-column Kanban (Todo → In Progress → Review → Testing → Done)  
- 🎯 **Task Management** – Create, view, edit, delete tasks in one interface  
- 🔐 **User Authentication** – Login/Register with form validation  
- 👤 **Profile Management** – Update profile, change password  
- 📱 **Responsive UI** – Mobile-first design  
- ⚡ **Real-time Updates** – Smooth interactions with drag-and-drop  

### 🔧 Backend (Node.js + Express + MongoDB)
- ✅ **User Authentication** with JWT & bcrypt password hashing  
- ✅ **CRUD APIs** for tasks  
- ✅ **Tasks linked to users**  
- ✅ **Protected routes** using auth middleware  
- ✅ **Centralized error handling**  
- ✅ **Rate limiting** for security  

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Axios, React Router, Context API  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Auth & Security:** JWT, bcryptjs, express-rate-limit, dotenv  
- **Notifications:** React Hot Toast  

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local instance

### 1. Clone Repository
```bash
git clone https://github.com/adityabagade333-coder/TaskMateAssesment.git
cd TaskMateAssesment

2. Setup Backend
cd backend
npm install
cp .env.example .env   # configure DB & JWT_SECRET
npm run dev

3. Setup Frontend
cd frontend
npm install
cp .env.example .env   # add API base URL
npm run dev

App runs on:
Frontend → http://localhost:5173
Backend → http://localhost:5000


📁 Project Structure

Backend
backend/
├── controllers/   # Business logic
├── middleware/    # Auth & error handling
├── models/        # MongoDB schemas
├── routes/        # API routes
├── validations/   # Joi validations
└── server.js      # Entry point

Frontend
frontend/
├── src/
│   ├── components/   # UI & workflow components
│   ├── context/      # Auth context
│   ├── services/     # Axios API calls
│   ├── pages/        # Login, Register, Dashboard, Profile
│   └── App.jsx       # Main App


👨‍💻 Author
Aditya Bagade
Full-Stack Developer.

⭐ If you liked this project, don’t forget to star the repo!

---
