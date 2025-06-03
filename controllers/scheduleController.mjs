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
  const { schedule_id, student_id, status, created_at} = req.body

  pool.query(
    'INSERT INTO schedules (schedule_id, student_id, status, created_at) VALUES ($1, $2, $3, $4)',
    [schedule_id, student_id, status, created_at], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`schedule added with ID: ${results.insertId}`)
  })
};

const updateSchedule = (req, res, next) => {
  const id = parseInt(req.params.id)
  const { schedule_id, student_id, status, created_at} = req.body

  pool.query(
    'UPDATE schedules SET id = $1, schedule_id = $2 , student_id= $3 , status = $4 , created_at = $5 WHERE id = $6',
    [id, schedule_id, student_id, status, created_at],
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