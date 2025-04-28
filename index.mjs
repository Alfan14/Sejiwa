import express from "express";
import cors from "cors";
import multer from 'multer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './db/queries.mjs';
import userRoutes from './routes/api/userRoute.mjs';


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

// Global error handling
app.use((err, _req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});