import express from "express";
import cors from "cors";
import multer from 'multer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './db/queries.mjs';
import db_booking from './db/queries_bookings.mjs';
import db_consultation from './db/queries_consultations.mjs';
import userRoutes from './routes/api/userRoute.mjs';
import  authMiddleware from './middlewares/authMiddleware.mjs';
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import chatHandler from "./sockets/chatHandler.mjs";
import initChatHandler from "./sockets/chatHandler.mjs";


// Call dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { authenticate, authorize } = authMiddleware

dotenv.config();

const router = express.Router();

const upload = multer();

// Initialize apps
const PORT = process.env.SERVER_PORT || 5000;
const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

// Body parser middleware
app.use(express.json())

// Uploading arrays
app.use(upload.array()); 

// Cors
app.use(cors());

// Users route
app.get('/users', authenticate, authorize(['admin']),db.getUsers)
app.get('/users/:id', authenticate, authorize(['admin']),db.getUserById)
app.post('/users', authenticate, authorize(['admin']),db.createUser)
app.put('/users/:id', authenticate, authorize(['admin']),db.updateUser)
app.delete('/users/:id', authenticate, authorize(['admin']),db.deleteUser)

//routes for the user API
app.use('/api/', userRoutes)

//routes for the booking
app.get('/api/bookings',authenticate, authorize(['konselor']) , db_booking.getBookings);
app.get('/api/bookings/:id',authenticate, authorize(['konselor']), db_booking.getBookingById);
app.post('/api/bookings', authenticate, authorize(['pelajar']),db_booking.createBooking);
app.put('/api/bookings/:id', authenticate, authorize(['pelajar','konselor']),db_booking.updateBooking);
app.delete('/api/bookings/:id',authenticate, authorize(['pelajar','konselor']), db_booking.deleteBooking);

// Routes for the schedule
app.get('/api/consultations', authenticate, authorize(['konselor']),db_consultation.getConsultations);
app.get('/api/consultations/:id', authenticate, authorize(['konselor']),db_consultation.getConsultationById);
app.post('/api/consultations', authenticate, authorize(['konselor']),db_consultation.createConsultation);
app.put('/api/consultations/:id', authenticate, authorize(['konselor']), db_consultation.updateConsultation);
app.delete('/api/consultations/:id', authenticate, authorize(['konselor']), db_consultation.deleteConsultation);

app.get("/", initChatHandler,(req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

io.on('connection', (socket) => {
  console.log('a client connected');
  socket.emit('to_client', { message: 'Hello from server!' });

  // Listen a message from the client
  socket.on('to_server', (data) => {
    console.log('From client:', data);
    socket.emit('to_client', { message: `Server Received: ${JSON.stringify(data)}` });

  console.log('user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
    });
  });
})
// Global error handling
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

// start the Express server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});