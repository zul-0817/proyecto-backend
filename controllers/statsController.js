import Juego from "../models/juego.js";
import Resena from "../models/resena.js";

export const obtenerEstadisticas = async (req, res) => {
  try {
    // -------------------------------
    // TOTAL DE JUEGOS
    // -------------------------------
    const totalJuegos = await Juego.countDocuments();

    // -------------------------------
    // TOTAL COMPLETADOS
    // -------------------------------
    const juegosCompletados = await Juego.countDocuments({ completado: true });

    // -------------------------------
    // HORAS TOTALES JUGADAS (Reseñas)
    // -------------------------------
    const horasData = await Resena.aggregate([
      { $group: { _id: null, total: { $sum: "$horasJugadas" } } }
    ]);

    const horasTotales = horasData[0]?.total || 0;

    // -------------------------------
    // PROMEDIO GENERAL DE PUNTUACIÓN
    // -------------------------------
    const puntuacionData = await Resena.aggregate([
      { $group: { _id: null, promedio: { $avg: "$puntuacion" } } }
    ]);

    const puntuacionPromedio = puntuacionData[0]?.promedio || 0;

    // -------------------------------
    // JUEGOS EN PROGRESO Y PENDIENTES
    // -------------------------------
    const juegosEnProgreso = await Juego.countDocuments({ progreso: { $gt: 0, $lt: 100 } });
    const juegosPendientes = await Juego.countDocuments({ progreso: 0 });

    // -------------------------------
    // RESPUESTA FINAL
    // -------------------------------
    res.json({
      totalJuegos,
      juegosCompletados,
      horasTotales,
      puntuacionPromedio: Number(puntuacionPromedio.toFixed(2)),
      juegosEnProgreso,
      juegosPendientes
    });

  } catch (error) {
    console.error("Error en estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
