import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

/* =======================
   GET TASKS BY CLIENT
======================= */
router.get("/:clientId", async (req, res) => {
  try {
    const tasks = await Task.find({ client_id: req.params.clientId })
      .sort({ due_date: 1 }); // nearest due date first

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   CREATE TASK (POST)
======================= */
router.post("/", async (req, res) => {
  try {
    const {
      client_id,
      title,
      description,
      category,
      due_date,
      priority
    } = req.body;

    // Validation (IMPORTANT)
    if (!client_id || !title || !description || !category || !due_date) {
      return res.status(400).json({
        error: "All required fields must be filled"
      });
    }

    const task = new Task({
      client_id,
      title,
      description,
      category,
      due_date,
      priority: priority || "Medium",
      status: "Pending"
    });

    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =======================
   TOGGLE STATUS (PUT)
   Pending <-> Completed
======================= */
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status:
          task.status === "Completed"
            ? "Pending"
            : "Completed"
      },
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =======================
   EDIT TASK (PUT)
======================= */
router.put("/edit/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      due_date,
      priority
    } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        due_date,
        priority
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =======================
   DELETE TASK
======================= */
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;