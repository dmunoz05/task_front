import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  };

  const login = async ({ username, password }) => {
    const res = await axios.post(`${import.meta.env.VITE_AUTH_API}/login`, { username, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const register = async ({ username, password }) => {
    return await axios.post(`${import.meta.env.VITE_AUTH_API}/register`, { username, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  const fetchTasks = async () => {
    const res = await axios.post(`${import.meta.env.VITE_TASK_API}/g/task`, authHeaders);
    setTasks(res.data);
  };

  const createTask = async (title) => {
    await axios.post(`${import.meta.env.VITE_TASK_API}/p/task`, { title: title }, authHeaders);
    await fetchTasks();
  };

  const updateTask = async (task) => {
    await axios.post(`${import.meta.env.VITE_TASK_API}/u/task`, task , authHeaders);
    await fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.post(`${import.meta.env.VITE_TASK_API}/d/task`, { id: id }, authHeaders);
    await fetchTasks();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        tasks,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
