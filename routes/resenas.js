import express from "express";
import Resena from "../models/resena.js";

const router = express.Router();

// GET - Obtener todas las reseñas
router.get("/", async (req, res) => {
  try {
    const resenas = await Resena.find().populate("juegoId");
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reseñas", error: error.message });
  }
});

// GET - Reseñas de un juego específico
router.get("/juego/:juegoId", async (req, res) => {
  try {
    const resenas = await Resena.find({ juegoId: req.params.juegoId });
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reseñas", error: error.message });
  }
});

// POST - Crear nueva reseña
router.post("/", async (req, res) => {
  try {
    const nuevaResena = new Reseña(req.body);
    const resenaGuardada = await nuevaResena.save();
    res.status(201).json(resenaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear reseña", error: error.message });
  }
});

// PUT - Actualizar reseña
router.put("/:id", async (req, res) => {
  try {
    const resenaActualizada = await Resena.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!resenaActualizada) {
      return res.status(404).json({ mensaje: "Reseña no encontrada" });
    }
    res.json(resenaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar reseña", error: error.message });
  }
});

// DELETE - Eliminar reseña
router.delete("/:id", async (req, res) => {
  try {
    const resenaEliminada = await Resena.findByIdAndDelete(req.params.id);
    if (!resenaEliminada) {
      return res.status(404).json({ mensaje: "Reseña no encontrada" });
    }
    res.json({ mensaje: "Reseña eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar reseña", error: error.message });
  }
});

export default router;