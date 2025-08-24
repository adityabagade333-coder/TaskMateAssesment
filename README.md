📋 TaskMate - MERN Task Management Application
A modern, secure, and responsive Task Management application built with the MERN Stack (MongoDB, Express.js, React, Node.js). The app features user authentication, CRUD operations for tasks, a drag-and-drop workflow board, and a clean, scalable architecture. Deployed on Render.
🌟 Live Demo
🚀 Live App: TaskMate📂 Repository: GitHub
✨ Features
Backend Features (Node.js + Express + MongoDB)

✅ User Authentication: Register and login with JWT (JSON Web Tokens).
✅ Task CRUD Operations: Create, Read, Update, and Delete tasks linked to authenticated users.
✅ Protected Routes: Authentication middleware ensures secure access to task endpoints.
✅ Rate Limiting: IP-based request limiting using express-rate-limit.
✅ Error Handling: Comprehensive error handling with async/await.
✅ Input Validation: Joi for request validation.
✅ Security: Password hashing with bcrypt, JWT stored in httpOnly cookies, and environment variables via .env.

Frontend Features (React + Axios)

✅ Authentication Pages: Register and Login pages with form validations.
✅ Protected Dashboard: Displays user tasks with add/edit/delete functionality.
✅ Drag & Drop Workflow Board: 5-column Kanban-style board (Todo, In Progress, Review, Testing, Done).
✅ State Management: React Context API for global state.
✅ Styling: Tailwind CSS for responsive, modern UI with dark mode support.
✅ Routing: React Router DOM for seamless navigation.
✅ Real-time Updates: Live task status updates and smooth drag-and-drop interactions.

Bonus Features

✅ Rate Limiting: Configured for authentication and task endpoints.
✅ Responsive Design: Mobile-first, works across all devices.
✅ Dark Mode: Toggle between light and dark themes.
✅ Profile Management: Update user details and change password.
✅ Task Details: Priority indicators, due dates, and completion status.

🛠️ Tech Stack

Backend:
Node.js
Express.js
MongoDB with Mongoose ODM
JWT for authentication
bcryptjs for password hashing
Joi for input validation
express-rate-limit for rate limiting


Frontend:
React 18 with Vite
Tailwind CSS v4
Axios for HTTP requests
React Router DOM for routing
React Context API for state management
Lucide React for icons
React Hot Toast for notifications


Deployment: Render
Other: ESLint, dotenv, CORS

📁 Project Structure
TaskMateAssesment/
├── backend/
│   ├── controllers/              # Auth and task controllers
│   ├── middleware/               # Auth and error handling middleware
│   ├── models/                   # User and Task schemas
│   ├── routes/                   # Auth and task routes
│   ├── validations/              # Joi validation schemas
│   ├── .env                     # Environment variables
│   ├── server.js                # Main server file
│   └── package.json             # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/          # Auth, workflow, tasks, layout, UI components
│   │   ├── context/             # Auth context
│   │   ├── services/            # API service layer
│   │   ├── utils/               # Utility functions
│   │   ├── pages/               # Dashboard, Profile, Login, Register
│   │   └── App.jsx              # Main app component
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
├── README.md                    # Documentation
└── .gitignore                   # Git ignore file

🚀 Quick Start
Prerequisites

Node.js (v18 or higher)
MongoDB (local or cloud instance, e.g., MongoDB Atlas)
npm

1. Clone Repository
git clone https://github.com/adityabagade333-coder/TaskMateAssesment.git
cd TaskMateAssesment

2. Backend Setup
cd backend
npm install

Create a .env file in the backend/ directory:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

Start MongoDB:
# Ubuntu/Debian
sudo systemctl start mongod
# macOS with Homebrew
brew services start mongodb/brew/mongodb-community

Run the backend:
npm run dev  # Development mode with nodemon
npm start    # Production mode

Backend will run on http://localhost:5000.
3. Frontend Setup
cd ../frontend
npm install

Create a .env file in the frontend/ directory:
VITE_API_URL=http://localhost:5000/api

Run the frontend:
npm run dev

Frontend will run on http://localhost:5173.
4. Deployment
The app is deployed on Render. To deploy your own instance:

Push the repository to GitHub.
Create a new Web Service on Render for the backend and a Static Site for the frontend.
Set environment variables in Render's dashboard:
MONGODB_URI: Your MongoDB connection string
JWT_SECRET: A secure JWT secret
JWT_EXPIRE: Token expiration (e.g., 7d)
VITE_API_URL: Backend API URL (e.g., https://your-backend.onrender.com/api)


Deploy both services.

📚 API Documentation
Authentication Endpoints



Method
Endpoint
Description
Access



POST
/api/auth/register
Register new user
Public


POST
/api/auth/login
Login user
Public


GET
/api/auth/me
Get current user
Private


Task Endpoints



Method
Endpoint
Description
Access



POST
/api/tasks
Create new task
Private


GET
/api/tasks
Get all user tasks
Private


GET
/api/tasks/:id
Get single task
Private


PUT
/api/tasks/:id
Update task
Private


DELETE
/api/tasks/:id
Delete task
Private


Example API Requests
Register a User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }'

Login User
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "123456"
  }'

Create a Task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Complete Project",
    "description": "Finish the task manager app",
    "priority": "high",
    "dueDate": "2025-08-30T10:00:00Z"
  }'

🔒 Security Features

Password Hashing: bcryptjs with salt rounds.
JWT Authentication: Tokens stored in httpOnly cookies for security.
Rate Limiting: 100 requests per 15 minutes per IP, 5 auth attempts per 15 minutes.
Input Validation: Joi for all incoming requests.
CORS Protection: Configurable cross-origin requests.
Environment Variables: Sensitive data stored in .env.

📊 Database Schema
User Model
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  timestamps: { createdAt, updatedAt }
}

Task Model
{
  title: String (required, max 100 chars),
  description: String (optional, max 500 chars),
  completed: Boolean (default: false),
  priority: String (enum: 'low'|'medium'|'high', default: 'medium'),
  dueDate: Date (optional),
  user: ObjectId (ref: User, required),
  timestamps: { createdAt, updatedAt }
}

🎯 How to Use

Authentication:
Register or login via the app's UI.
On successful login, you're redirected to the dashboard.


Managing Tasks:
Create tasks using the "+" button in any column.
View, edit, or delete tasks via task cards.
Drag and drop tasks between columns (Todo, In Progress, Review, Testing, Done).


Profile Management:
Update name, email, or password from the profile section.


Dark Mode:
Toggle between light and dark themes via the navbar.



📝 Scripts
# Backend
cd backend
npm run dev     # Start development server with nodemon
npm start       # Start production server

# Frontend
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build

📱 Responsive Design

Mobile-First: Optimized for touch interactions.
Tablet-Friendly: Works seamlessly on iPads and similar devices.
Desktop Enhanced: Rich hover states and animations.
Cross-Browser: Compatible with all modern browsers.

🤝 Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/amazing-feature).
Commit changes (git commit -m 'Add amazing feature').
Push to the branch (git push origin feature/amazing-feature).
Open a Pull Request.

🐛 Issues
Report issues on GitHub Issues.
👨‍💻 Author
Aditya BagadeFull-Stack Developer

GitHub: @adityabagade333-coder
LinkedIn: Connect with me

📄 License
This project is licensed under the MIT License.
📚 Theory Questions & Answers
1. How would you scale a MERN application? (5 Marks)
To scale a MERN application:

Horizontal Scaling: Add more Node.js instances behind a load balancer (e.g., NGINX, AWS ELB) to distribute traffic across multiple servers.
Database Optimization: Use MongoDB indexes for faster queries, implement sharding for large datasets, and leverage replica sets for read scalability.
Caching: Implement Redis or Memcached for caching frequent queries (e.g., user sessions, task lists).
Microservices: Split the app into microservices (e.g., auth service, task service) for independent scaling.
Deployment: Use PM2 for process management, Docker for containerization, and Kubernetes for orchestration.
CDN: Serve static assets (React build files) via a CDN like Cloudflare.
Query Optimization: Avoid N+1 queries, use aggregation pipelines in MongoDB, and paginate results.
Monitoring: Use tools like New Relic or Prometheus for performance monitoring.

This ensures high availability, performance, and fault tolerance.
2. Pros and Cons of using MongoDB for relational data? (5 Marks)
Pros:

Flexible Schema: MongoDB’s document model allows easy schema evolution for relational data.
Scalability: Horizontal scaling via sharding and replica sets is straightforward.
JSON-like Documents: Simplifies data modeling for nested relationships.
Performance: Fast for read-heavy operations with proper indexing.

Cons:

No Native Joins: Lacks SQL-style joins, requiring manual aggregation or multiple queries.
Data Consistency: Eventual consistency in distributed setups may cause issues for strict relational integrity.
Complex Transactions: Multi-document transactions are supported but less efficient than SQL databases.
Storage Overhead: Documents can be larger than relational tables, increasing storage needs.

For relational data, MongoDB suits flexible, non-join-heavy use cases but may require careful design for complex relationships.
3. Fix the following code and explain the issue: (5 Marks)
Original Code:
app.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user.name);
});

Issue:

No Error Handling: If User.findById fails (e.g., invalid ID, user not found), the app may crash or return an unhandled error.
Potential Null Reference: If user is null (user not found), accessing user.name will throw an error.
No Status Codes: Lacks proper HTTP status codes for success or failure.
Security: Exposes the entire user object’s name without checking if the requester is authorized.

Fixed Code:
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ name: user.name });
  } catch (error) {
    res.status(400).json({ message: 'Invalid user ID' });
  }
});

Explanation:

Added try-catch to handle errors (e.g., invalid MongoDB ObjectId).
Checked if user exists to avoid null reference errors.
Used .select('name') to retrieve only the name field for security.
Returned appropriate HTTP status codes (200 for success, 404 for not found, 400 for invalid ID).
Responded with JSON for consistency with REST API standards.

4. How does React rendering work when state is updated? Explain with example. (5 Marks)
React rendering updates the UI when state changes via the Virtual DOM:

State Update: When setState is called, React marks the component for re-rendering.
Re-render: React calls the component’s render function to generate a new Virtual DOM tree.
Diffing: React compares the new Virtual DOM with the previous one to identify changes.
DOM Update: Only the changed parts are updated in the real DOM, minimizing performance overhead.

Example:
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}


Clicking the button calls increment, updating count.
React re-renders Counter, creating a new Virtual DOM with the updated count.
The diffing process identifies that only the <p> text has changed.
The real DOM updates only the text node, leaving the button unchanged.

This ensures efficient updates and a responsive UI.
5. Write React code to display a table of users. (5 Marks)
JSON Data:
[
  { "id": 1, "name": "Amit", "email": "amit@example.com" },
  { "id": 2, "name": "Sara", "email": "sara@example.com" }
]

React Code:
import { useState, useEffect } from 'react';
import axios from 'axios';

function UserTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('https://taskmateassesment-1.onrender.com/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <table className="min-w-full border-collapse border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">ID</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className="hover:bg-gray-100">
            <td className="border p-2">{user.id}</td>
            <td className="border p-2">{user.name}</td>
            <td className="border p-2">{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;

Explanation:

Uses useState to store users and useEffect to fetch data on mount.
Renders a table with Tailwind CSS for styling.
Maps over the users array to display each user’s ID, name, and email.
Includes error handling for API failures.
Uses key prop for efficient rendering.

6. What is the difference between PUT and PATCH? (5 Marks)

PUT:

Purpose: Updates an entire resource by replacing it with the provided data.
Idempotent: Multiple identical PUT requests yield the same result.
Data: Requires the full resource representation in the request body.
Example: Updating a task with all fields:PUT /api/tasks/1
{
  "title": "New Title",
  "description": "New Desc",
  "priority": "high",
  "dueDate": "2025-08-30",
  "completed": false
}


Use Case: When the client wants to replace the entire resource.


PATCH:

Purpose: Partially updates a resource by modifying specific fields.
Not Always Idempotent: Depends on the implementation (e.g., increment operations).
Data: Only includes the fields to be updated.
Example: Updating only the task’s title:PATCH /api/tasks/1
{
  "title": "Updated Title"
}


Use Case: When the client wants to update specific fields without affecting others.



Key Difference: PUT replaces the entire resource, while PATCH updates specific fields, making PATCH more efficient for partial updates.

⭐ If you find this project helpful, please give it a star! ⭐
Built with ❤️ by Aditya Bagade using the MERN Stack
