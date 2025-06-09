import pool from "../db/index.mjs";

const createRoom = (req, res) => {
  const { title , participants } = req.body

  pool.query(
    'INSERT INTO rooms (title , participants) VALUES ($1, $2)',
    [title , participants], (error, results) => {
      if (error) {
        throw error
      }
      const insertedId = results.rows[0].id;

      res.status(201).json({ id: insertedId })
    })
};

const getRoom = (req, res, next) => {
    
    pool.query('SELECT * FROM rooms  ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}


const getRoomById = (req, res, next) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM rooms WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

export default {
  getRoom,
  getRoomById,
  createRoom,
}