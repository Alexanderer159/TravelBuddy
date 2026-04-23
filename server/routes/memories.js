import { Router } from "express";
import Memory from "../models/Memory.js";
import auth from "../middleware/auth.js";

const router = Router();

// GET /api/memories — get all memories for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user.id }).sort({ date: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/memories — create a memory
router.post("/", auth, async (req, res) => {
  try {
    const { place, date, images, name } = req.body;
    if (!place || !date || !images?.length || !name)
      return res.status(400).json({ message: "name, place, date and images are required" });

    const memory = await Memory.create({ user: req.user.id, place, date, images, name });
    res.status(201).json(memory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/memories/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const memory = await Memory.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!memory) return res.status(404).json({ message: "Memory not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/memories/:id/favorite — toggle favorite on a memory
router.patch("/:id/favorite", auth, async (req, res) => {
  try {
    const user = await (await import("../models/User.js")).default.findById(req.user.id);
    const id = req.params.id;
    const idx = user.favoriteMemories.indexOf(id);
    if (idx === -1) user.favoriteMemories.push(id);
    else user.favoriteMemories.splice(idx, 1);
    await user.save();
    res.json({ favoriteMemories: user.favoriteMemories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;