import React, { useState, useEffect } from "react";


const API_URL = "https://playground.4geeks.com/todo/todos/erikruiz";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTaskLabel, setNewTaskLabel] = useState("");

 
  const createUser = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ label: "placeholder", done: false }),
      headers: { "Content-Type": "application/json" }
    });
    await deleteTaskById(0); 
  };

  
  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Fallo al obtener tareas");
      const data = await res.json();
      setTasks(data.todos || []);
    } catch (error) {
      console.log("Error al obtener tareas:", error.message);
    }
  };

  
  const addTask = async () => {
    if (!newTaskLabel.trim()) return;

    const task = { label: newTaskLabel.trim(), done: false };

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" }
    });

    setNewTaskLabel("");
    fetchTasks();
  };

  
  const deleteTaskById = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  
  const clearAllTasks = async () => {
    for (const task of tasks) {
      await deleteTaskById(task.id);
    }
  };

  
  useEffect(() => {
    createUser().then(fetchTasks);
  }, []);

  return (
    <div className="todo-container">
      <h1>📝 Lista de tareas 📝</h1>

      <input
        type="text"
        placeholder="Nueva tarea..."
        value={newTaskLabel}
        onChange={(e) => setNewTaskLabel(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <button onClick={addTask}>Agregar</button>
      <button onClick={clearAllTasks} style={{ marginLeft: "10px", color: "red" }}>
        Limpiar lista
      </button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.label}
            <button onClick={() => deleteTaskById(task.id)}>❌</button>
          </li>
        ))}
      </ul>

      <p>Total: {tasks.length} tareas</p>
    </div>
  );
}
