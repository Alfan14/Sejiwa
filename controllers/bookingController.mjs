import pool from "../db/index.mjs";

const getBookings = (req, res, next) => {

  pool.query('SELECT * FROM bookings ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

const getBookingById = (req, res, next) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM bookings WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

const createBooking = (req, res) => {
  const { schedule_id, student_id, counselor_id , status, created_at } = req.body

  pool.query(
    'INSERT INTO bookings (schedule_id, student_id, counselor_id, status, created_at) VALUES ($1, $2, $3, $4, $5)',
    [schedule_id, student_id, counselor_id, status, created_at], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`Booking added with ID: ${results.insertId}`)
    })
};

const patchUser = async (request, response) => {
    const id = parseInt(request.params.id);
    const {  schedule_id, student_id, counselor_id , status, created_at } = request.body;

    const fields = [];
    const values = [];
    let valueIndex = 1;

    if (schedule_id) {
      fields.push(`schedule_id = $${valueIndex++}`);
      values.push(schedule_id);
    }
    if (student_id) {
      fields.push(`student_id = $${valueIndex++}`);
      values.push(student_id);
    }
    if (counselor_id) {
      fields.push(`counselor_id = $${valueIndex++}`);
      values.push(counselor_id);
    }
    if (status) {
      fields.push(`status = $${valueIndex++}`);
      values.push(status);
    }
    if (created_at) {
      fields.push(`created_at = $${valueIndex++}`);
      values.push(created_at);
    }

    if (fields.length === 0) {
      return response.status(400).json({ message: "No fields to update." });
    }

    values.push(id);
    const query = `UPDATE bookings SET ${fields.join(', ')} WHERE id = $${valueIndex}`;

    pool.query(query, values, (error, results) => {
      if (error) {
        return response.status(500).json({ message: "Update failed.", error });
      }
      response.status(200).send(`Booking with ID: ${id} patched.`);
    });
  };



const updateBooking = async (req, res, next) => {
  const id = parseInt(req.params.id)
  const { schedule_id, student_id, counselor_id, status, created_at } = req.body;

  try {
    await pool.query(
      'UPDATE bookings SET  schedule_id = $1 , student_id= $2 , counselor_id= $3,  status = $4 , created_at = $5 WHERE id = $6',
      [schedule_id, student_id, counselor_id, status, created_at ,id],
    );
    res.status(200).send(`Schedule modified with ID: ${id}`);
  } catch (error) {
    console.error('Database update error:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
};
const deleteBooking = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM bookings WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Booking deleted with ID: ${id}`)
  })
};

export default {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
}