import pool from "../db/index.mjs";

const createRoom = (req, res) => {
  const { title , participants } = req.body

  pool.query(
    'INSERT INTO rooms (title , participants) VALUES ($1, $2)',
    [title , participants], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`Room added with ID: ${results.insertId}`)
    })
};

export default {
  createRoom,
}