import pool from "../db/index.mjs";

const getSchedules = (req, res, next) => {
    
    pool.query('SELECT * FROM schedules ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

const getScheduleById = (req, res, next) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM schedules WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

const createSchedule = (req, res) => {
  const { date, time, is_available ,counselor_id } = req.body

  pool.query(
    'INSERT INTO schedules ( date, time, is_available ,counselor_id) VALUES ($1, $2, $3, $4)',
    [ date, time, is_available ,counselor_id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`schedule added with ID: ${results.insertId}`)
  })
};

const updateSchedule = (req, res, next) => {
  const id = parseInt(req.params.id)
  const {date, time, is_available ,counselor_id } = req.body

  pool.query(
    'UPDATE schedules SET id = $1, date = $2 , time = $3 , is_available = $4 , counselor_id = $5 WHERE id = $6',
    [id, date, time, is_available ,counselor_id],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`schedule modified with ID: ${id}`)
    }
  )
};

const deleteSchedule = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM schedules WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`schedule deleted with ID: ${id}`)
  })
};

export default {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
}