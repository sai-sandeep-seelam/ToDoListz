import React, { useState, useEffect } from "react";
import TaskItem from "./components/TaskItem";
import TaskForm from "./components/TaskForm";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(true); 

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
  document.body.className = darkMode ? "dark" : "light";
}, [darkMode]);

  const addTask = (text) => {
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
  };

  const toggleTask = (id) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    // sort: incomplete first, completed last
    updated.sort((a, b) => a.completed - b.completed);
    setTasks(updated);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, newText) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    );
    // maintain sorting
    updated.sort((a, b) => a.completed - b.completed);
    setTasks(updated);
  };

  const filteredTasks = tasks.filter(task =>
  filter === "all" ? true :
  filter === "pending" ? !task.completed :
  task.completed
);


  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <header>
        <h1>To-Do List</h1>
        <button
          className="toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? "🌙" : "🌞"}
        </button>
      </header>

      <TaskForm addTask={addTask} />

      <div className="filters">
  <button
    onClick={() => setFilter("all")}
    className={filter === "all" ? "active" : ""}
  >
    All
  </button>
  <button
    onClick={() => setFilter("pending")}
    className={filter === "pending" ? "active" : ""}
  >
    Pending
  </button>
  <button
    onClick={() => setFilter("completed")}
    className={filter === "completed" ? "active" : ""}
  >
    Completed
  </button>
</div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        ))}
      </ul>

      <footer>
        <p>ToDoListz - Hub for listing tasks.</p>
      </footer>
    </div>
  );
}
