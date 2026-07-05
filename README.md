# ToDo Task Management App

## Project Overview

The ToDo Task Management App is a full-stack web application designed to help users efficiently manage and organize their daily tasks. It provides a simple and intuitive interface to create, update, track, and delete tasks while maintaining clear visibility of task status and priority.

The system follows a client-server architecture with a RESTful API built using Node.js and Express.js, and MySQL used for persistent data storage.

---

## Key Features

- Create, update, and delete tasks
- Mark tasks as **Pending** or **Completed**
- Set task priority (High, Medium, Low)
- Filter tasks by status and priority
- Search tasks by title or description
- Real-time dashboard showing task statistics
- Clean and responsive user interface
- Fully API-driven frontend-backend communication
- Filter tasks by status and priority independently or in combination (e.g., Completed + High Priority or Pending + Low Priority)
---

## Purpose

This project demonstrates full-stack development skills including CRUD operations, REST API integration, database management, and frontend-backend communication using modern web technologies.

It is designed as a practical task management solution with scalable architecture and maintainable code structure.

---



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
![Dashboard](screenshots/Dashboard.png)

### Add Task
![Add Task](screenshots/Update_task.png)



## Repository

GitHub: https://github.com/SanduniNimasha/task_management


