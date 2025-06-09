import express from "express";
import cors from "cors";
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer } from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import path from "path";

// route
import assessmentRoutes from './routes/api/assesmentRoute.mjs';
import analyticRoutes from './routes/api/analyticsRoute.mjs';
import scheduleRoutes from './routes/api/scheduleRoute.mjs';
import userRoutes from "./routes/api/userRoute.mjs";
import roomRoutes from "./routes/api/chatsRoute.mjs";
import authRoutes from './routes/api/authRoute.mjs';
import bookingsRoutes from './routes/api/bookingsRoute.mjs';
import consultationRoutes from './routes/api/consultationsRoute.mjs';
import recomendationRoutes from "./routes/api/recomendationRoute.mjs";
import initChatHandler from "./sockets/chatHandler.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const upload = multer();
const PORT = process.env.SERVER_PORT || 5000;
const app = express();

// === CORS FIX ===
const corsOptions = {
  origin: ['http://localhost:3000', 'https://sejiwa-frontend.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// === END CORS FIX ===

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://sejiwa-frontend.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
initChatHandler(io);

// Middleware
app.use(express.json());
app.use(upload.array());

// Routes
app.use('/api/', userRoutes);
app.use('/api/', authRoutes);
app.use('/api/', bookingsRoutes);
app.use('/api/', consultationRoutes);
app.use('/api/', assessmentRoutes);
app.use('/api', recomendationRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', analyticRoutes);
app.use('/api', roomRoutes);

app.get("/", (req, res) => {
  res.send("This is the default Server Route");
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
