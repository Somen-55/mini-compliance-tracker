import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// Get tasks by client
router.get("/:clientId", async (req, res) => {
  try {
    const tasks = await Task.find({ client_id: req.params.clientId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task
router.post("/", async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      status: "Pending"
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mark complete
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    const newStatus =
      task.status === "Completed" ? "Pending" : "Completed";

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Edit task
router.put("/edit/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;