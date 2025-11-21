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
    // PROMEDIO DE PROGRESO
    // -------------------------------
    const progreso = await Juego.aggregate([
      { $group: { _id: null, promedio: { $avg: "$progreso" } } }
    ]);

    const promedioProgreso = progreso[0]?.promedio || 0;

    // -------------------------------
    // PROMEDIO DE PUNTUACIÓN POR JUEGO
    // -------------------------------
    const puntuacionPorJuego = await Resena.aggregate([
      {
        $group: {
          _id: "$juegoId",
          promedioPuntuacion: { $avg: "$puntuacion" }
        }
      }
    ]);

    // -------------------------------
    // PROMEDIO GENERAL DE TODAS LAS RESEÑAS
    // -------------------------------
    const puntuacionGeneral = await Resena.aggregate([
      {
        $group: {
          _id: null,
          promedio: { $avg: "$puntuacion" }
        }
      }
    ]);

    const puntuacionPromedioGeneral = puntuacionGeneral[0]?.promedio || 0;

    res.json({
      totalJuegos,
      juegosCompletados,
      promedioProgreso,
      puntuacionPromedioGeneral,
      puntuacionPorJuego
    });

  } catch (error) {
    console.error("Error en estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
