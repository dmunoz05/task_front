// TasksPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, LogOut } from "lucide-react";
import Modal from "react-modal";

export default function TasksPage() {
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const openCreateModal = () => {
    setEditingTask(null);
    setTaskTitle("");
    setTaskDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setTaskTitle("");
    setTaskDescription("");
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim()) return;

    if (editingTask) {
      await updateTask({ id: editingTask.id, title: taskTitle, completed: editingTask.completed });
    } else {
      await createTask(taskTitle);
    }
    closeModal();
  };

  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      await updateTask({ id, title: task.title, completed: !task.completed });
    }
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
  };

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div></div>
            <h1 className="text-2xl font-bold text-gray-800">TaskManager</h1>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Mis Tareas</h2>
            <p className="text-gray-600 mt-1">Gestiona tus tareas diarias de manera eficiente</p>
          </div>
          <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Tarea
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay tareas</h3>
                <p className="text-gray-500 mb-6">Comienza creando tu primera tarea</p>
                <Button onClick={openCreateModal} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Tarea
                </Button>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`mt-1 ${task.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(task)}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="max-w-md mx-auto mt-20 bg-white rounded-lg shadow-xl p-6 outline-none"
        overlayClassName="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-start justify-center px-4"
        ariaHideApp={false}
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {editingTask ? "Editar Tarea" : "Nueva Tarea"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
              <Input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Ingresa el título de la tarea"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Describe la tarea (opcional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTask} disabled={!taskTitle.trim()} className="bg-blue-600 hover:bg-blue-700">
              {editingTask ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}