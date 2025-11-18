import express from "express";
import Juego from "../models/juego.js";

const router = express.Router();

// GET - Obtener todos los juegos
router.get("/", async (req, res) => {
  try {
    const juegos = await Juego.find().sort({ fechaCreacion: -1 });
    res.json(juegos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener juegos", error: error.message });
  }
});

// GET - Obtener un juego por ID
router.get("/:id", async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id);
    if (!juego) {
      return res.status(404).json({ mensaje: "Juego no encontrado" });
    }
    res.json(juego);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el juego", error: error.message });
  }
});

// POST - Crear nuevo juego
router.post("/", async (req, res) => {
  try {
    const nuevoJuego = new Juego(req.body);
    const juegoGuardado = await nuevoJuego.save();
    res.status(201).json(juegoGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear juego", error: error.message });
  }
});

// PUT - Actualizar juego
router.put("/:id", async (req, res) => {
  try {
    const juegoActualizado = await Juego.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!juegoActualizado) {
      return res.status(404).json({ mensaje: "Juego no encontrado" });
    }
    res.json(juegoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar juego", error: error.message });
  }
});

// DELETE - Eliminar juego
router.delete("/:id", async (req, res) => {
  try {
    const juegoEliminado = await Juego.findByIdAndDelete(req.params.id);
    if (!juegoEliminado) {
      return res.status(404).json({ mensaje: "Juego no encontrado" });
    }
    res.json({ mensaje: "Juego eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar juego", error: error.message });
  }
});

export default router;