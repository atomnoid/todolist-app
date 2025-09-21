# Todo List Application

A beautiful, modern todo list application with user authentication, dark/light mode, and MongoDB backend.

## Features

### 🎨 **Beautiful UI**
- Modern glass-morphism design
- Smooth animations and transitions
- Responsive design for all devices
- Floating background graphics
- Dark/Light mode toggle

### 🔐 **Authentication**
- User registration and login
- JWT token-based authentication
- Secure password hashing
- User profile management
- Account deletion with confirmation

### 📝 **Task Management**
- Create, edit, delete tasks
- Mark tasks as complete/incomplete
- Filter tasks (All, Active, Completed)
- Bulk operations
- Task statistics
- Real-time updates

### 🚀 **Technical Features**
- MongoDB database
- Express.js backend
- RESTful API
- Input validation
- Error handling
- CORS support

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd todolist-app/todolist
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/todolist
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5000
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system

5. **Start the application:**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

6. **Access the application:**
   Open `http://localhost:5000` in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `DELETE /api/auth/account` - Delete account

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle completion
- `PUT /api/tasks/bulk` - Bulk update
- `DELETE /api/tasks/bulk` - Bulk delete
- `GET /api/tasks/stats` - Get task statistics

## Usage

1. **Register/Login:** Create an account or login with existing credentials
2. **Add Tasks:** Type in the input field and press Enter or click "Add Task"
3. **Manage Tasks:** Click checkbox to complete, edit button to modify, delete button to remove
4. **Filter Tasks:** Use All/Active/Completed buttons to filter tasks
5. **Theme Toggle:** Click the moon/sun icon to switch between dark and light modes
6. **Clear Completed:** Use "Clear Completed" button to remove finished tasks

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens, bcryptjs
- **Validation:** express-validator
- **Styling:** CSS Variables, Glass-morphism, Animations

## Project Structure

```
todolist-app/todolist/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   └── taskController.js   # Task management logic
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Task.js            # Task model
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── taskRoutes.js      # Task routes
│   └── server.js              # Main server file
├── public/
│   ├── index.html             # Main HTML file
│   ├── style.css              # Styles with dark/light mode
│   ├── script.js              # Frontend JavaScript
│   └── api.js                 # API service
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
