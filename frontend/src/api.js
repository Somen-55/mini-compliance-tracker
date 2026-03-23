import axios from "axios";

const API = "http://localhost:5000/api";

export const getClients = () => axios.get(`${API}/clients`);
export const createClient = (data) => axios.post(`${API}/clients`, data);

export const getTasks = (id) => axios.get(`${API}/tasks/${id}`);
export const createTask = (data) => axios.post(`${API}/tasks`, data);
export const updateTask = (id) => axios.put(`${API}/tasks/${id}`);
export const deleteTask = (id) => axios.delete(`${API}/tasks/${id}`);
export const editTask = (id, data) =>
  axios.put(`${API}/tasks/edit/${id}`, data);