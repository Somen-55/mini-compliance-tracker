import express from "express";
import Client from "../models/Client.js";

const router = express.Router();

/* =======================
   GET ALL CLIENTS
======================= */
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   GET SINGLE CLIENT
======================= */
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =======================
   CREATE CLIENT (POST)
======================= */
router.post("/", async (req, res) => {
  try {
    const { company_name, country, entity_type } = req.body;

    // Validation (IMPORTANT for assignment)
    if (!company_name || !country || !entity_type) {
      return res.status(400).json({
        error: "company_name, country, and entity_type are required"
      });
    }

    const client = new Client({
      company_name,
      country,
      entity_type
    });

    await client.save();

    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =======================
   UPDATE CLIENT (PUT)
======================= */
router.put("/:id", async (req, res) => {
  try {
    const { company_name, country, entity_type } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      {
        company_name,
        country,
        entity_type
      },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =======================
   DELETE CLIENT
======================= */
router.delete("/:id", async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);

    if (!deletedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;