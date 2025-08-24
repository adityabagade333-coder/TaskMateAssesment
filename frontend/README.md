# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# 📋 TaskMate - Task Management App

A modern task management application built with **React** and **Tailwind CSS** featuring a beautiful drag-and-drop workflow board.

## 🌟 Live Demo

🚀 **Live App:** [TaskMate](https://taskmateassesment-1.onrender.com)  
📂 **Repository:** [GitHub](https://github.com/adityabagade333-coder/TaskMateAssesment.git)

## ✨ Features

- 🎯 **Drag & Drop Workflow Board** - 5-column Kanban-style task management (Todo → In Progress → Review → Testing → Done)
- 🎨 **Beautiful Task Cards** - Priority indicators, due dates, and smooth hover animations
- 📝 **Unified Task Management** - Create, view, edit, and delete tasks in one interface
- 🔐 **User Authentication** - Secure login/register with form validation
- 👤 **Profile Management** - Update profile information and change password
- 🌙 **Dark Mode Support** - Complete light/dark theme switching
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ⚡ **Real-time Updates** - Live task status updates and drag-and-drop functionality

## 🛠️ Tech Stack

- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Routing:** React Router DOM
- **State Management:** React Context API

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Clone Repository

```bash
git clone https://github.com/adityabagade333-coder/TaskMateAssesment.git
cd TaskMateAssesment/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://taskmateassesment-1.onrender.com/api
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # Login, Register, Protected Routes
│   │   ├── workflow/          # Workflow Board, Task Cards, Columns
│   │   ├── tasks/             # Task Form Modal
│   │   ├── layout/            # Navbar, Layout
│   │   └── ui/                # Reusable components (Button, Input, Loading)
│   ├── context/               # Auth Context
│   ├── services/              # API service layer
│   ├── utils/                 # Utility functions
│   ├── pages/                 # Dashboard, Profile, Login, Register
│   └── App.jsx                # Main app component
├── public/                    # Static assets
└── package.json               # Dependencies
```

## 🎯 How to Use

### 1. **Authentication**
- Visit the app and register for a new account
- Login with your credentials
- You'll be redirected to the workflow dashboard

### 2. **Managing Tasks**
- **Create Tasks:** Click the "+" button in any column
- **View Tasks:** Click on any task card to view details
- **Edit Tasks:** Click the edit button or "Edit Task" in task details
- **Delete Tasks:** Click the delete button with confirmation
- **Move Tasks:** Drag and drop tasks between columns

### 3. **Workflow Columns**
- **Todo:** New tasks to be started
- **In Progress:** Tasks currently being worked on
- **Review:** Tasks awaiting review
- **Testing:** Tasks being tested
- **Done:** Completed tasks

### 4. **Profile Management**
- Click on your profile in the navbar
- Update your name and email
- Change your password securely

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

## 🎨 Features in Detail

### Workflow Board
- **5-Column Layout:** Organized task flow
- **Drag & Drop:** Smooth task movement
- **Visual Feedback:** Hover effects and animations
- **Task Counters:** Live count in each column

### Task Cards
- **Priority Colors:** Visual priority indicators
- **Due Dates:** Smart date formatting (Today, Tomorrow, Overdue)
- **Hover Actions:** Quick edit and delete buttons
- **Status Indicators:** Visual completion status

### User Experience
- **Responsive Design:** Works perfectly on mobile and desktop
- **Dark Mode:** Toggle between light and dark themes
- **Smooth Animations:** Polished interactions throughout
- **Form Validation:** Real-time validation with helpful messages

## 🔐 Authentication Features

- **Secure Login/Register** with form validation
- **JWT Token Management** with automatic refresh
- **Protected Routes** requiring authentication
- **Auto-logout** on token expiration
- **Password Change** functionality



## 📱 Responsive Design

- **Mobile-First:** Optimized for touch interactions
- **Tablet-Friendly:** Perfect for iPad and similar devices
- **Desktop Enhanced:** Rich hover states and animations
- **Cross-Browser:** Works on all modern browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Issues

If you encounter any issues, please report them on [GitHub Issues](https://github.com/adityabagade333-coder/TaskMateAssesment/issues).

## 👨‍💻 Author

**[Aditya Bagade](https://github.com/adityabagade333-coder)**  
Full-Stack Developer

- GitHub: [@adityabagade333-coder](https://github.com/adityabagade333-coder)
- LinkedIn: [Connect with me](https://linkedin.com/in/aditya-bagade)

## 📄 License

This project is licensed under the MIT License.

---

**⭐ If you find this project helpful, please give it a star! ⭐**

**Built with ❤️ using React and Tailwind CSS**# 📋 TaskMate - Task Management App

A modern task management application built with **React** and **Tailwind CSS** featuring a beautiful drag-and-drop workflow board.

## 🌟 Live Demo

🚀 **Live App:** [TaskMate](https://taskmateassesment-1.onrender.com)  
📂 **Repository:** [GitHub](https://github.com/adityabagade333-coder/TaskMateAssesment.git)

## ✨ Features

- 🎯 **Drag & Drop Workflow Board** - 5-column Kanban-style task management (Todo → In Progress → Review → Testing → Done)
- 🎨 **Beautiful Task Cards** - Priority indicators, due dates, and smooth hover animations
- 📝 **Unified Task Management** - Create, view, edit, and delete tasks in one interface
- 🔐 **User Authentication** - Secure login/register with form validation
- 👤 **Profile Management** - Update profile information and change password
- 🌙 **Dark Mode Support** - Complete light/dark theme switching
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ⚡ **Real-time Updates** - Live task status updates and drag-and-drop functionality

## 🛠️ Tech Stack

- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Routing:** React Router DOM
- **State Management:** React Context API

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Clone Repository

```bash
git clone https://github.com/adityabagade333-coder/TaskMateAssesment.git
cd TaskMateAssesment/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://taskmateassesment-1.onrender.com/api
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # Login, Register, Protected Routes
│   │   ├── workflow/          # Workflow Board, Task Cards, Columns
│   │   ├── tasks/             # Task Form Modal
│   │   ├── layout/            # Navbar, Layout
│   │   └── ui/                # Reusable components (Button, Input, Loading)
│   ├── context/               # Auth Context
│   ├── services/              # API service layer
│   ├── utils/                 # Utility functions
│   ├── pages/                 # Dashboard, Profile, Login, Register
│   └── App.jsx                # Main app component
├── public/                    # Static assets
└── package.json               # Dependencies
```

## 🎯 How to Use

### 1. **Authentication**
- Visit the app and register for a new account
- Login with your credentials
- You'll be redirected to the workflow dashboard

### 2. **Managing Tasks**
- **Create Tasks:** Click the "+" button in any column
- **View Tasks:** Click on any task card to view details
- **Edit Tasks:** Click the edit button or "Edit Task" in task details
- **Delete Tasks:** Click the delete button with confirmation
- **Move Tasks:** Drag and drop tasks between columns

### 3. **Workflow Columns**
- **Todo:** New tasks to be started
- **In Progress:** Tasks currently being worked on
- **Review:** Tasks awaiting review
- **Testing:** Tasks being tested
- **Done:** Completed tasks

### 4. **Profile Management**
- Click on your profile in the navbar
- Update your name and email
- Change your password securely

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

## 🎨 Features in Detail

### Workflow Board
- **5-Column Layout:** Organized task flow
- **Drag & Drop:** Smooth task movement
- **Visual Feedback:** Hover effects and animations
- **Task Counters:** Live count in each column

### Task Cards
- **Priority Colors:** Visual priority indicators
- **Due Dates:** Smart date formatting (Today, Tomorrow, Overdue)
- **Hover Actions:** Quick edit and delete buttons
- **Status Indicators:** Visual completion status

### User Experience
- **Responsive Design:** Works perfectly on mobile and desktop
- **Dark Mode:** Toggle between light and dark themes
- **Smooth Animations:** Polished interactions throughout
- **Form Validation:** Real-time validation with helpful messages

## 🔐 Authentication Features

- **Secure Login/Register** with form validation
- **JWT Token Management** with automatic refresh
- **Protected Routes** requiring authentication
- **Auto-logout** on token expiration
- **Password Change** functionality



## 📱 Responsive Design

- **Mobile-First:** Optimized for touch interactions
- **Tablet-Friendly:** Perfect for iPad and similar devices
- **Desktop Enhanced:** Rich hover states and animations
- **Cross-Browser:** Works on all modern browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Issues

If you encounter any issues, please report them on [GitHub Issues](https://github.com/adityabagade333-coder/TaskMateAssesment/issues).

## 👨‍💻 Author

**[Aditya Bagade](https://github.com/adityabagade333-coder)**  
Full-Stack Developer

- GitHub: [@adityabagade333-coder](https://github.com/adityabagade333-coder)
- LinkedIn: [Connect with me](https://linkedin.com/in/aditya-bagade)

## 📄 License

This project is licensed under the MIT License.
---

**Built with ❤️ by [Aditya Bagade](https://aditya.codeclout.in) using the MERN Stack**

**⭐ If you find this project helpful, please give it a star! ⭐**