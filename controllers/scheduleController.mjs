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
  const { date, time, is_available, counselor_id } = req.body;

  pool.query(
    'INSERT INTO schedules (date, time, is_available, counselor_id) VALUES ($1, $2, $3, $4) RETURNING id',
    [date, time, is_available, counselor_id],
    (error, results) => {
      if (error) {
        console.error('Database insert error:', error);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).send(`Schedule added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateSchedule = async (req, res) => {
  const id = parseInt(req.params.id);
  const { date, time, is_available, counselor_id } = req.body;

  try {
    await pool.query(
      'UPDATE schedules SET date = $1, time = $2, is_available = $3, counselor_id = $4 WHERE id = $5',
      [date, time, is_available, counselor_id, id]
    );
    res.status(200).send(`Schedule modified with ID: ${id}`);
  } catch (error) {
    console.error('Database update error:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
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