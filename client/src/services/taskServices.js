import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getTasks = async (search = "") => {
  const response = await API.get("/tasks", {
    params: { search },
  });
  return response.data.tasks;
};

export const createTask = async (taskData) => {
  const response = await API.post("/tasks", taskData);
  return response.data.task;
};

export const updateTask = async (id, taskData) => {
  const response = await API.patch(`/tasks/${id}`, taskData);
  return response.data.task;
};

export const deleteTask = async (id) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};
