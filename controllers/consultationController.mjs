const getConsultations = (req, res) => {

    pool.query('SELECT * FROM consultations ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

const getConsultationById = (req, res, next)=> {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM consultations WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

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

const updateConsultation = (req, res) => {
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
};

const deleteConsultation = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM consultations WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`consultation deleted with ID: ${id}`)
  })
};

export default {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
}