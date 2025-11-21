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
    // 🔥 TOP 5 JUEGOS MÁS JUGADOS
    // -------------------------------
    const top5Juegos = await Resena.aggregate([
      {
        $group: {
          _id: "$juegoId",
          totalHoras: { $sum: "$horasJugadas" }
        }
      },
      { $sort: { totalHoras: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "juegos",
          localField: "_id",
          foreignField: "_id",
          as: "juegoInfo"
        }
      },
      { $unwind: "$juegoInfo" },
      {
        $project: {
          titulo: "$juegoInfo.titulo",
          horas: "$totalHoras"
        }
      }
    ]);

    // -------------------------------
    // 📊 GÉNEROS FAVORITOS (CORREGIDO)
    // -------------------------------
    const generosFavoritos = await Juego.aggregate([
      {
        $match: { genero: { $exists: true, $ne: null } } // Validar que exista el campo
      },
      {
        $group: {
          _id: "$genero", // Campo en singular
          cantidad: { $sum: 1 }
        }
      },
      { $sort: { cantidad: -1 } },
      { $limit: 5 },
      {
        $project: {
          genero: "$_id",
          cantidad: 1,
          _id: 0
        }
      }
    ]);

    // Calcular porcentajes
    const totalGeneros = generosFavoritos.reduce((sum, g) => sum + g.cantidad, 0);
    const generosConPorcentaje = generosFavoritos.map(g => ({
      genero: g.genero,
      porcentaje: totalGeneros > 0 ? Math.round((g.cantidad / totalGeneros) * 100) : 0
    }));

    // -------------------------------
    // RESPUESTA FINAL
    // -------------------------------
    res.json({
      totalJuegos,
      juegosCompletados,
      horasTotales,
      puntuacionPromedio: Number(puntuacionPromedio.toFixed(2)),
      juegosEnProgreso,
      juegosPendientes,
      top5Juegos,
      generosFavoritos: generosConPorcentaje
    });

  } catch (error) {
    console.error("Error en estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};

