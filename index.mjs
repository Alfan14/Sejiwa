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

const { authenticate, authorize } = authMiddleware

dotenv.config();

const router = express.Router();

const upload = multer();

// Initialize apps
const PORT = process.env.SERVER_PORT || 5000;
const app = express()

// Body parser middleware
app.use(express.json())

// Uploading arrays
app.use(upload.array()); 

// Cors
app.use(cors());

// Use route
// app.use('/auth', authRoutes); 
// app.use('/api/consultations', consultations);

// Users route
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

//routes for the user API
app.use('/api/', userRoutes)

//routes for the booking
app.get('/api/bookings', authenticate , db_booking.getBookings);
app.get('/api/bookings/:id', db_booking.getBookingById)
app.post('/api/bookings', db_booking.createBooking)
app.put('/api/bookings/:id', db_booking.updateBooking)
app.delete('/api/bookings/:id', db_booking.deleteBooking)

// Routes for the schedule
app.get('/api/consultations', db_consultation.getConsultations)
app.get('/api/consultations/:id', db_consultation.getConsultationById)
app.post('/api/consultations', authenticate, authorize(['konselor']),db_consultation.createConsultation);
app.put('/api/consultations/:id', db_consultation.updateConsultation)
app.delete('/api/consultations/:id', db_consultation.deleteConsultation)

// Global error handling
app.use((err, _req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});