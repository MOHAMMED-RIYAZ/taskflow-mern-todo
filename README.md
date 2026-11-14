# TaskFlow – MERN Stack To-Do Application

A responsive task management application built using the MERN stack. TaskFlow helps users organize their tasks, manage deadlines, track progress, and stay productive.

## 🚀 Live Demo

**Live Application:** https://remarkable-biscotti-be7c58.netlify.app/

**Backend API:** https://taskflow-mern-todo.onrender.com

## ✨ Features

- Create, edit, and delete tasks.
- Add task titles, descriptions, due dates, and times.
- Set task priorities: Low, Medium, and High.
- Track task status: In Progress and Completed.
- Search tasks by title and description.
- Organize tasks by week, starting Monday.
- View weekly Open and Completed task counts.
- Expand and collapse weekly task sections.
- Responsive user interface for mobile, tablet, and desktop.

## 🛠️ Tech Stack

**Frontend**

- React.js
- Vite
- Tailwind CSS
- Axios
- Lucide React
- date-fns

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose

**Deployment**

- Netlify – Frontend
- Render – Backend
- MongoDB Atlas – Database

## 📁 Project Structure

```text
todo-app/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/MOHAMMED-RIYAZ/taskflow-mern-todo.git
cd taskflow-mern-todo
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm run dev
```

### 3. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the client folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## 🔗 API Endpoints

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| GET    | `/api/tasks`     | Get all tasks and search tasks |
| POST   | `/api/tasks`     | Create a task                  |
| PATCH  | `/api/tasks/:id` | Update a task                  |
| DELETE | `/api/tasks/:id` | Delete a task                  |

## 🔐 Environment Variables

Keep environment variables private. Never commit `.env` files, database credentials, or API secrets to GitHub.

## 👨‍💻 Developer

**Mohammed Riyaz**

GitHub: https://github.com/MOHAMMED-RIYAZ

Portfolio: https://riyaz-portfolio-eight.vercel.app

---

Built with the MERN stack.
