import express from "express";
import Reseña from "../models/reseña.js";

const router = express.Router();

// GET - Obtener todas las reseñas
router.get("/", async (req, res) => {
  try {
    const reseñas = await Reseña.find().populate("juegoId");
    res.json(reseñas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reseñas", error: error.message });
  }
});

// GET - Reseñas de un juego específico
router.get("/juego/:juegoId", async (req, res) => {
  try {
    const reseñas = await Reseña.find({ juegoId: req.params.juegoId });
    res.json(reseñas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reseñas", error: error.message });
  }
});

// POST - Crear nueva reseña
router.post("/", async (req, res) => {
  try {
    const nuevaReseña = new Resena(req.body);
    const reseñaGuardada = await nuevaReseña.save();
    res.status(201).json(reseñaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear reseña", error: error.message });
  }
});

// PUT - Actualizar reseña
router.put("/:id", async (req, res) => {
  try {
    const reseñaActualizada = await Reseña.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!reseñaActualizada) {
      return res.status(404).json({ mensaje: "Reseña no encontrada" });
    }
    res.json(reseñaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar reseña", error: error.message });
  }
});

// DELETE - Eliminar reseña
router.delete("/:id", async (req, res) => {
  try {
    const reseñaEliminada = await Reseña.findByIdAndDelete(req.params.id);
    if (!reseñaEliminada) {
      return res.status(404).json({ mensaje: "Reseña no encontrada" });
    }
    res.json({ mensaje: "Reseña eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar reseña", error: error.message });
  }
});

export default router;