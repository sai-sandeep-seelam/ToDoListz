import React, { useState } from "react";

export default function TaskItem({ task, toggleTask, deleteTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const handleSave = () => {
    if (!newText.trim()) return;
    editTask(task.id, newText);
    setIsEditing(false);
  };

  return (
    <li className={`task ${task.completed ? "completed" : ""}`}>
      <div className="left">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
        />
        {isEditing ? (
          <input
            className="edit-input"
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        ) : (
          <span>{task.text}</span>
        )}
      </div>
      <div className="actions">
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        )}
        <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </li>
  );
}
