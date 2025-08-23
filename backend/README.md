# 📋 Task Manager Backend - MERN Application

A simple and secure Task Manager backend built with **Node.js**, **Express.js**, and **MongoDB** with JWT authentication.

## 🚀 Features

### Core Features
- ✅ **User Authentication** - Register & Login with JWT
- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete tasks
- ✅ **User-Task Relationship** - Each task is linked to a specific user
- ✅ **Protected Routes** - Authentication middleware protection

### Bonus Features
- ✅ **Rate Limiting** - IP-based request limiting using `express-rate-limit`
- ✅ **Proper Error Handling** - Global error handling middleware
- ✅ **Input Validation** - Request validation using Joi
- ✅ **Async/Await** - Modern async patterns throughout

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi
- **Security:** Rate limiting, CORS, Password hashing (bcryptjs)

## 📁 Project Structure

```
task-manager-backend/
├── controllers/
│   ├── auth.controller.js      # Authentication logic
│   └── task.controller.js      # Task CRUD operations
├── middleware/
│   ├── auth.middleware.js      # JWT authentication middleware
│   └── errorHandler.middleware.js # Global error handler
├── models/
│   ├── user.modal.js           # User schema
│   └── task.modal.js           # Task schema
├── routes/
│   ├── auth.routes.js          # Authentication routes
│   └── tasks.routes.js         # Task routes
├── validations/
│   ├── auth.validation.js      # Auth input validation
│   └── task.validation.js      # Task input validation
├── .env                        # Environment variables
├── .env.example               # Environment template
├── package.json               # Dependencies
├── server.js                  # Main server file
└── README.md                  # Documentation
```

## ⚡ Quick Start

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd task-manager-backend

# Install dependencies
npm install

# Install dev dependencies
npm install -D nodemon
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your values
nano .env
```

### 3. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (Ubuntu/Debian)
sudo systemctl start mongod

# Or using MongoDB service
brew services start mongodb/brew/mongodb-community
```

### 4. Run the Application

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will start on: `http://localhost:5000`

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Task Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/tasks` | Create new task | Private |
| GET | `/api/tasks` | Get all user tasks | Private |
| GET | `/api/tasks/:id` | Get single task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |

## 🧪 API Testing

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }'
```

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "123456"
  }'
```

**Save the token from the response!**

### 3. Create a Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Complete Project",
    "description": "Finish the task manager app",
    "priority": "high",
    "dueDate": "2025-08-30T10:00:00Z"
  }'
```

### 4. Get All Tasks

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔒 Authentication

This application uses **JWT (JSON Web Tokens)** for authentication:

1. User registers/logs in and receives a JWT token
2. Token must be included in the `Authorization` header for protected routes
3. Format: `Authorization: Bearer <your_token_here>`
4. Token expires in 7 days (configurable in `.env`)

## ✅ Data Validation

### User Registration
- **Name**: 2-50 characters, required
- **Email**: Valid email format, unique, required
- **Password**: Minimum 6 characters, required

### Task Creation
- **Title**: 1-100 characters, required
- **Description**: Max 500 characters, optional
- **Priority**: 'low', 'medium', 'high' (default: 'medium')
- **Due Date**: Valid ISO date, optional
- **Completed**: Boolean (default: false)

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Auth Rate Limiting**: 5 auth attempts per 15 minutes per IP
- **Input Validation**: Joi validation on all inputs
- **CORS Protection**: Configurable cross-origin requests

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars)
  email: String (required, unique, valid email)
  password: String (required, min 6 chars, hashed)
  timestamps: { createdAt, updatedAt }
}
```

### Task Model
```javascript
{
  title: String (required, max 100 chars)
  description: String (optional, max 500 chars)
  completed: Boolean (default: false)
  priority: String (enum: 'low'|'medium'|'high', default: 'medium')
  dueDate: Date (optional)
  user: ObjectId (ref: User, required)
  timestamps: { createdAt, updatedAt }
}
```

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: 400 with detailed error messages
- **Authentication Errors**: 401 for invalid/missing tokens
- **Authorization Errors**: 403 for insufficient permissions
- **Not Found Errors**: 404 for non-existent resources
- **Server Errors**: 500 for internal server errors
- **Rate Limit Errors**: 429 for too many requests

## 🧪 Testing

Use the provided CURL commands in the API Testing section above to test all endpoints.

## 📝 Scripts

```bash
# Start server in development mode
npm run dev

# Start server in production mode
npm start
```

## 👨‍💻 Developer

**Built by [Aditya Bagade](https://aditya.codeclout.in)**  
Full-Stack Developer | React, Node.js, TypeScript Expert


## 📄 License

This project is licensed under the ISC License.

## 🌟 Next Steps

- [ ] Add password reset functionality
- [ ] Implement task categories
- [ ] Add task sharing between users
- [ ] Add file attachments to tasks
- [ ] Implement task reminders
- [ ] Add task search and filtering
- [ ] Build React frontend

---

**Built with ❤️ by [Aditya Bagade](https://aditya.codeclout.in) using the MERN Stack**