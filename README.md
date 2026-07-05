# Task Management System

A fully functional Task Management System built using:

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express.js
- Database: MySQL

It allows users to:
- Create tasks
- Update tasks
- Delete tasks
- Mark tasks as completed or pending
- Filter tasks by status and priority
- Search tasks
- View dashboard statistics

## Features

- Add new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed or pending
- Filter by status (All / Pending / Completed)
- Filter by priority (High / Medium / Low)
- Search tasks
- Dashboard with task statistics
- Responsive UI
- Toast notifications for actions

  ## Tech Stack

Frontend:
- HTML5
- CSS3
- JavaScript (Vanilla JS)

Backend:
- Node.js
- Express.js

Database:
- MySQL

  ## Installation

### 1. Clone repository
git clone https://github.com/SanduniNimasha/task_management.git

### 2. Install backend dependencies
cd backend
npm install

### 3. Setup MySQL database

Create database:
CREATE DATABASE task_manager;

Create table:

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### 4. Configure database connection

Edit db.js:
host: "localhost"
user: "root"
password: ""
database: "task_manager"

### Backend
Start server:
node server.js

### Frontend
Use Live Server (VS Code recommended)
Runs on: http://127.0.0.1:5500

## Usage

1. Start MySQL server
2. Run backend:
   node server.js
3. Open frontend using Live Server
4. Start managing tasks:
   - Add tasks
   - Update tasks
   - Delete tasks
   - Filter tasks

## Folder Structure

task-manager/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── controllers/
│   └── routes/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── screenshots/
└── README.md

## Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Add Task
![Add Task](screenshots/add-task.png)

### Edit Task
![Edit Task](screenshots/edit-task.png)

## Repository

GitHub: https://github.com/SanduniNimasha/task_management


