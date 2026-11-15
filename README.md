# TaskFlow – MERN Stack To-Do Application

A responsive task management application built using the MERN stack. TaskFlow helps users organize their daily activities, manage deadlines, set priorities, and track task progress through a clean and intuitive interface.

## 🚀 Live Demo

- **Live Application:** https://remarkable-biscotti-be7c58.netlify.app/
- **Backend API:** https://taskflow-mern-todo.onrender.com
- **GitHub Repository:** https://github.com/MOHAMMED-RIYAZ/taskflow-mern-todo

## ✨ Features

- **Task Management:** Create, edit, and delete tasks.
- **Task Details:** Add titles, descriptions, due dates, and times.
- **Priority Management:** Assign Low, Medium, or High priority.
- **Task Status:** Track tasks as In Progress or Completed.
- **Search Functionality:** Search tasks by title and description.
- **Weekly Organization:** Navigate between weeks and organize tasks from Monday to Sunday.
- **Weekly Progress:** View weekly Open and Completed task counts.
- **Task Filtering:** View tasks based on the selected date or search results.
- **Swipe to Delete:** Delete tasks using the mobile-friendly swipe interaction.
- **Responsive Design:** Optimized for mobile, tablet, and desktop screens.

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- Lucide React
- date-fns

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Deployment and Database

- Netlify – Frontend Hosting
- Render – Backend Hosting
- MongoDB Atlas – Cloud Database

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
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/MOHAMMED-RIYAZ/taskflow-mern-todo.git
cd taskflow-mern-todo
```

### 2. Configure the Backend

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 3. Configure the Frontend

Open a new terminal and navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal to access TaskFlow.

## 🔗 API Endpoints

| Method | Endpoint         | Description                         |
| ------ | ---------------- | ----------------------------------- |
| GET    | `/api/tasks`     | Retrieve all tasks and search tasks |
| POST   | `/api/tasks`     | Create a new task                   |
| PATCH  | `/api/tasks/:id` | Update an existing task             |
| DELETE | `/api/tasks/:id` | Delete a task                       |

### Search Example

```text
GET /api/tasks?search=Java
```

Search supports matching task titles and descriptions.

## 🔐 Environment Variables

The application uses environment variables to manage configuration.

**Backend (`server/.env`)**

- `PORT` – Backend server port.
- `MONGO_URI` – MongoDB connection string.

**Frontend (`client/.env`)**

- `VITE_API_URL` – Backend API base URL.

Never commit `.env` files, database credentials, or sensitive configuration values to GitHub.

## 👨‍💻 Developer

**Mohammed Riyaz**

- **GitHub:** https://github.com/MOHAMMED-RIYAZ
- **Portfolio:** https://riyaz-portfolio-eight.vercel.app

---

Built with ❤️ using the MERN Stack.
