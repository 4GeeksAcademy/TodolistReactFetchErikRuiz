import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const user = 'erikruizh'; 
  const apiUrl = `https://playground.4geeks.com/todo/users/${user}`; 
  const postUrl = `https://playground.4geeks.com/todo/todos/${user}`; 

  
  useEffect(() => {
    checkAndCreateUser();
  }, []);

  
  const checkAndCreateUser = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        
        if (response.status === 404) {
          createUser();
        } else {
          throw new Error(`Error al verificar usuario: ${response.status}`);
        }
      } else {
        fetchTasks(); 
      }
    } catch (error) {
      console.error('Error al verificar o crear usuario:', error);
    }
  };

  
  const createUser = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users', {
        method: 'POST',
        body: JSON.stringify({ name: user }), 
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al crear usuario: ${response.status}`);
      }

      fetchTasks(); 
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  
  const fetchTasks = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error al obtener tareas: ${response.status}`);
      }

      const data = await response.json();

      
      if (Array.isArray(data.todos)) {
        setTasks(data.todos);
      } else {
        console.error('Los datos no son un array:', data);
      }
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    }
  };

  
  const addTask = async () => {
    if (newTask.trim() !== "") {
      const task = { 
        label: newTask,  
        is_done: false   
      };

      try {
        const response = await fetch(postUrl, {
          method: 'POST',
          body: JSON.stringify(task), 
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json', 
          },
        });

        if (!response.ok) {
          throw new Error(`Error al agregar tarea: ${response.status}`);
        }

        setNewTask(""); 
        fetchTasks(); 
      } catch (error) {
        console.error('Error al agregar tarea:', error);
      }
    }
  };

  
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json', 
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar tarea: ${response.status}`);
      }

      fetchTasks(); 
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  
  const clearAllTasks = async () => {
    try {
      
      for (const task of tasks) {
        const response = await fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
          method: 'DELETE',
          headers: {
            'accept': 'application/json',  
          },
        });

        if (!response.ok) {
          throw new Error(`Error al eliminar tarea: ${response.status}`);
        }
      }

      fetchTasks(); 
    } catch (error) {
      console.error('Error al limpiar todas las tareas:', error);
    }
  };

  return (
    <div>
      <h1>Lista de Tareas Erik Ruiz</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Agregar tarea"
      />
      <button onClick={addTask}>Agregar</button>
      <button onClick={clearAllTasks}>Limpiar todas las tareas</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.label}
            <button onClick={() => deleteTask(task.id)}>Eliminar</button>
            
            <button onClick={() => toggleTaskCompletion(task.id, task.is_done)}>
              {task.is_done ? 'Marcar como no completada' : 'Marcar como completada'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;