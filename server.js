import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import juegoRoutes from "./routes/juegos.js";
import resenaRoutes from "./routes/resenas.js";

// Configurar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Obtener URI de MongoDB desde .env
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(" Conectado a MongoDB Atlas"))
  .catch((err) => console.error(" Error de conexión a MongoDB:", err));

// Ruta 
app.use("/api/juegos", juegoRoutes);
app.use("/api/resenas", resenaRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.json({ 
    mensaje: " API funcionando",
    endpoints: {
      juegos: "/api/juegos",
      reseñas: "/api/resenas"
    }
  });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

