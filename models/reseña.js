import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reseñaSchema = new Schema({
  juegoId: {
    type: Schema.Types.ObjectId,
    ref: "Juego",
    required: [true, "El ID del juego es obligatorio"]
  },
  puntuacion: {
    type: Number,
    required: [true, "La puntuación es obligatoria"],
    min: [1, "La puntuación mínima es 1"],
    max: [5, "La puntuación máxima es 5"]
  },
  textoReseña: {
    type: String,
    required: [true, "El texto de la reseña es obligatorio"],
    minlength: [10, "La reseña debe tener al menos 10 caracteres"],
    maxlength: [2000, "La reseña no puede exceder 2000 caracteres"]
  },
  horasJugadas: {
    type: Number,
    default: 0,
    min: [0, "Las horas jugadas no pueden ser negativas"]
  },
  dificultad: {
    type: String,
    enum: {
      values: ["Fácil", "Media", "Difícil", "Muy Difícil"],
      message: "Dificultad no válida"
    },
    default: "Media"
  },
  recomendaria: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default model("reseña", reseñaSchema);