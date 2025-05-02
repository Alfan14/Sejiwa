import dotenv from 'dotenv';
import pg from 'pg';
import authenticateJWT from '../middlewares/authenticationJWT.mjs';
import rbacMiddleware from '../middlewares/rbacMiddleware.mjs';

const Pool = pg.Pool

dotenv.config(); 

const USER = process.env.DB_USER ;
const HOST = process.env.DB_HOST ; 
const DB = process.env.DB_NAME;
const PASSWORD = process.env.DB_PASSWORD;
const PORT = process.env.DB_PORT ;

const pool = new Pool({
  user: USER,
  host: HOST,
  database: DB,
  password: PASSWORD,
  port: PORT,
})

const getBookings = (authenticateJWT ,  async (req, res, next) => await rbacMiddleware.checkPermission('read_booking')(req, res, next) , async (req, res, next) => {
    
    pool.query('SELECT * FROM bookings ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

const getBookingById = (authenticateJWT ,  async (req, res, next) => await rbacMiddleware.checkPermission('read_booking')(req, res, next) , async (req, res, next) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM bookings WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

const createBooking = (authenticateJWT ,  async (req, res, next) => await rbacMiddleware.checkPermission('create_booking')(req, res, next) , async (req, res, next) => {
  const { schedule_id, student_id, status, created_at} = req.body

  pool.query(
    'INSERT INTO bookings (schedule_id, student_id, status, created_at) VALUES ($1, $2, $3, $4)',
    [schedule_id, student_id, status, created_at], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`Booking added with ID: ${results.insertId}`)
  })
});

const updateBooking = (authenticateJWT ,  async (req, res, next) => await rbacMiddleware.checkPermission('update_booking')(req, res, next) , async (req, res, next) => {
  const id = parseInt(req.params.id)
  const { schedule_id, student_id, status, created_at} = req.body

  pool.query(
    'UPDATE bookings SET id = $1, schedule_id = $2 , student_id= $3 , status = $4 , created_at = $5 WHERE id = $6',
    [id, schedule_id, student_id, status, created_at],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`Booking modified with ID: ${id}`)
    }
  )
});

const deleteBooking = (authenticateJWT ,  async (req, res, next) => await rbacMiddleware.checkPermission('delete_booking')(req, res, next) , async (req, res, next) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM bookings WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Booking deleted with ID: ${id}`)
  })
});

export default {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
}