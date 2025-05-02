import dotenv from 'dotenv';
import pg from 'pg';
import rbacMiddleware from '../middlewares/rbacMiddleware.mjs';
import authenticateJWT from '../middlewares/authenticationJWT.mjs';

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

const getConsultations = (req, res) => {

    pool.query('SELECT * FROM consultations ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

const getConsultationById = (authenticateJWT ,  async (req, res, next) => await rbacMiddleware.checkPermission('read_consultation')(req, res, next) , async (req, res, next) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM consultations WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

const createConsultation = (req, res) =>{
  const { booking_id, counselor_notes, student_notes, started_at , ended_at} = req.body

  pool.query(
    'INSERT INTO consultations (booking_id, counselor_notes, student_notes, started_at , ended_at) VALUES ($1, $2, $3, $4, $5)',
    [booking_id, counselor_notes, student_notes, started_at , ended_at], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`consultation added with ID: ${results.insertId}`)
  })
};

const updateConsultation = (authenticateJWT ,  async (req, res, next) => await rbacMiddleware.checkPermission('update_consultation')(req, res, next) , async (req, res, next) => {
  const id = parseInt(req.params.id)
  const { booking_id, counselor_notes, student_notes, started_at , ended_at} = req.body

  pool.query(
    'UPDATE consultations SET booking_id = $1,counselor_notes = $2, student_notes= $3 ,  started_at = $4 , ended_at = $5 WHERE id = $6',
    [id, booking_id, counselor_notes, student_notes, started_at , ended_at],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`consultation modified with ID: ${id}`)
    }
  )
});

const deleteConsultation = (authenticateJWT ,  async (req, res, next) => await rbacMiddleware.checkPermission('delete_consultation')(req, res, next) , async (req, res, next) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM consultations WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`consultation deleted with ID: ${id}`)
  })
});

export default {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
}