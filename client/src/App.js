import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      alert("Task title cannot be empty");
      return;
    }

    try {
      await axios.post("http://localhost:5000/addtask", {
        title: title.trim(),
      });
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleEdit = async (id, currentTitle) => {
    const newTitle = prompt("✏ Enter new title:", currentTitle);
    if (!newTitle || newTitle.trim() === "") return;

    try {
      await axios.put(`http://localhost:5000/updatetask/${id}`, {
        title: newTitle.trim(),
      });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/deletetask/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(" Error deleting task:", err);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2> Task Manager</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your task"
        style={{ padding: "10px", width: "250px" }}
      />

      <button
        onClick={handleAdd}
        style={{
          marginLeft: "10px",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
         Add
      </button>

      <ul style={{ marginTop: "30px", fontSize: "18px" }}>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginBottom: "10px" }}>
             {task.title}
            <button
              onClick={() => handleEdit(task._id, task.title)}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "orange",
                border: "none",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "red",
                border: "none",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
               Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
