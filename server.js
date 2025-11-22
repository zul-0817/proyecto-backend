import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import juegoRoutes from "./routes/juegos.js";
import resenaRoutes from "./routes/resenas.js";
import statsRoutes from "./routes/statsroutes.js";

// Configurar variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS para permitir peticiones desde GitHub Pages
const corsOptions = {
  origin: [
    'http://localhost:5173', // Desarrollo local (Vite)
    'http://localhost:5174', 
    'https://zul-0817.github.io', // GitHub Pages
    'https://yasha2583.github.io' // Por si usan el otro usuario
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Obtener URI de MongoDB desde .env
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error de conexión a MongoDB:", err));

// Rutas
app.use("/api/juegos", juegoRoutes);
app.use("/api/resenas", resenaRoutes);
app.use("/api/stats", statsRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.json({ 
    mensaje: "✅ API funcionando",
    endpoints: {
      juegos: "/api/juegos",
      reseñas: "/api/resenas",
      estadísticas: "/api/stats"
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});