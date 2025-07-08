const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/taskdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.log("Error fetching tasks:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Add new task
app.post("/addtask", async (req, res) => {
  console.log("Request Body Received:", req.body);
  
  const { title } = req.body;

  if (!title || title.trim() === "") {
    console.log("Title is missing");
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const newTask = new Task({ title });
    await newTask.save();
    console.log("Task saved to MongoDB");
    res.status(201).json({ message: "Task added successfully" });
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ error: "Failed to save task" });
  }
});


//  Update task by ID
app.put("/updatetask/:id", async (req, res) => {
  const { title } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    res.json({ message: "Task updated", updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task by ID
app.delete("/deletetask/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(" Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('Server running at http://localhost:${PORT}');
});