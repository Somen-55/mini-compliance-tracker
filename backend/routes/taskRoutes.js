import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// Get tasks for a client
router.get("/:clientId", async (req, res) => {
  try {
    const tasks = await Task.find({ client_id: req.params.clientId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new task
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update task status
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.status = "Completed";
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;