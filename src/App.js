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

  // Initialize theme from localStorage (fallback to system preference)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("todo-theme"); // 'dark' | 'light' | null
      if (saved === "dark") return true;
      if (saved === "light") return false;
      // fallback to system pref
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) {
      return true;
    }
  });

  // persist tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // apply theme class to body and persist theme
  useEffect(() => {
    // keep both classes correct on body
    document.body.classList.toggle("dark", darkMode);
    document.body.classList.toggle("light", !darkMode);

    localStorage.setItem("todo-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addTask = (text) => {
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
  };

  const toggleTask = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    // sort: incomplete first, completed last
    updated.sort((a, b) => a.completed - b.completed);
    setTasks(updated);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id, newText) => {
    const updated = tasks.map((task) => (task.id === id ? { ...task, text: newText } : task));
    // maintain sorting
    updated.sort((a, b) => a.completed - b.completed);
    setTasks(updated);
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "all" ? true : filter === "pending" ? !task.completed : task.completed
  );

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <header>
        <h1>To-Do List</h1>
        <button
          className="toggle-btn"
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle theme"
          aria-pressed={darkMode}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "🌙" : "🌞"}
        </button>
      </header>

      <TaskForm addTask={addTask} />

      <div className="filters">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>
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
        {filteredTasks.map((task) => (
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
