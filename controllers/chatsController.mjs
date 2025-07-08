import pool from "../db/index.mjs";

// cors issue
const createRoom = (req, res) => {
  const { title, student_id , counselor_id } = req.body;

  pool.query(
    'INSERT INTO rooms (title, student_id ,counselor_id) VALUES ($1, $2 , $3) RETURNING id',
    [title, student_id, counselor_id],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to create room' });
      }

      const insertedId = results.rows[0].id;
      res.status(201).json({ id: insertedId });
    }
  );
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