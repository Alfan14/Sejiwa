import express from "express";
import cors from "cors";
import multer from 'multer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createServer } from "http";
import { fileURLToPath } from "url";
import path from "path";

// route
import assessmentRoutes from './routes/api/assesmentRoute.mjs';
import analyticRoutes from './routes/api/analyticsRoute.mjs';
import scheduleRoutes from './routes/api/scheduleRoute.mjs';
import userRoutes from "./routes/api/userRoute.mjs"
import authRoutes from './routes/api/authRoute.mjs';
import bookingsRoutes from './routes/api/bookingsRoute.mjs';
import consultationRoutes from './routes/api/consultationsRoute.mjs';
import recomendationRoutes from "./routes/api/recomendationRoute.mjs";
import initChatHandler from "./sockets/chatHandler.mjs";

// Call dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const upload = multer();

// Initialize apps
const PORT = process.env.SERVER_PORT || 5000;
const app = express();
const httpServer = createServer(app);
initChatHandler(httpServer);

// Body parser middleware
app.use(express.json())

// Uploading arrays
app.use(upload.array()); 

// Cors
app.use(cors());

// Users route
app.use('/api/', userRoutes)

//routes for the user API
app.use('/api/', authRoutes)

//routes for the booking
app.use('/api/', bookingsRoutes)

// Routes for the schedule
app.use('/api/', consultationRoutes)

// Routes for the assessment
app.use('/api/', assessmentRoutes)

// Routes for the recomendation 
app.use('/api',recomendationRoutes)

// Route for the schedule
app.use('/api',scheduleRoutes)

// Route for the analytics
app.use('/api',analyticRoutes)

app.get("/",(req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});
  
// Global error handling
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

// start the Express server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});