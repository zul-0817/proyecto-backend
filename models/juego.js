import mongoose from "mongoose";

const { Schema, model } = mongoose;

const juegoSchema = new Schema({
  titulo: {
    type: String,
    required: [true, "El título es obligatorio"],
    trim: true,
    minlength: [1, "El título debe tener al menos 1 carácter"],
    maxlength: [150, "El título no puede exceder 150 caracteres"]
  },
  genero: {
    type: String,
    required: [true, "El género es obligatorio"],
    enum: {
      values: [
        "Acción",
        "Aventura",
        "RPG",
        "Estrategia",
        "Deportes",
        "Carreras",
        "Simulación",
        "Puzzle",
        "Plataformas",
        "Shooter",
        "Multijugador",
        "Indie",
        "Otros"
      ],
      message: "Género no válido"
    }
  },
  plataforma: {
    type: String,
    required: [true, "La plataforma es obligatoria"],
    enum: {
      values: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile", "Otros"],
      message: "Plataforma no válida"
    }
  },
  añoLanzamiento: {
    type: Number,
    min: [1950, "Año de lanzamiento inválido"],
    max: [new Date().getFullYear(), "Año de lanzamiento inválido"]
  },
  desarrollador: {
    type: String,
    trim: true,
    maxlength: [100, "Nombre del desarrollador demasiado largo"]
  },
  imagenPortada: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/).+$/,
      "La imagen de portada debe ser una URL válida (http/https)"
    ]
  },
  descripcion: {
    type: String,
    maxlength: [2000, "Descripción demasiado larga"]
  },
  progreso: {
  type: Number,
  min: 0,
  max: 100,
  default: 0
},

  completado: {
    type: Boolean,
    default: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default model("Juego", juegoSchema);
