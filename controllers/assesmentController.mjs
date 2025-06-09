import pool from "../db/index.mjs";

const getQuestions = (req, res, next) => {
    
    pool.query('SELECT * FROM assessment_questions ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

const submitAssessment = async (req, res) => {
    const { answers } = req.body;
    
    if (!answers || answers.length === 0) {
        return res.status(400).json({ message: "Bad request" });
    }
    
    try {
        // 1. Ambil mapping dari database berdasarkan kode emosi
        const results = await pool.query(
          `SELECT ar.recommendation_id, ar.weight 
           FROM assessment_recommendations ar
           JOIN assessment_questions aq ON aq.id = ar.question_id
           WHERE aq.code = ANY($1)`,
          [answers]
        );
        
        //  2. Akumulasi skor berdasarkan recommendation_id
        const scoreMap = {};
        results.rows.forEach(row => {
            if (!scoreMap[row.recommendation_id]) {
            scoreMap[row.recommendation_id] = 0;
            }
            scoreMap[row.recommendation_id] += row.weight;
        });

        // 3. Urutkan berdasarkan skor tertinggi
        const sortedRecommendations = Object.entries(scoreMap)
        .sort((a, b) => b[1] - a[1]) // Urutkan berdasarkan skor
        .map(entry => parseInt(entry[0])); // Ambil ID rekomendasi

        // 4. Ambil detail rekomendasi berdasarkan ID yang diurutkan
        const recommendationDetails = await pool.query(
            `SELECT * FROM recommendations WHERE id = ANY($1)`,
            [sortedRecommendations]
        );
        // Kirim hasil ke pelajar
    res.status(200).json({ recommendations: recommendationDetails.rows });

    } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
};

const saveAssessmentAnswer = (req, res) =>{
  const { student_id, question_code , submitted_at } = req.body

  pool.query(
    'INSERT INTO assessment_answers ( student_id, question_code , submitted_at) VALUES ($1, $2, $3)',
    [ student_id, question_code , submitted_at], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`student added with ID: ${results.insertId}`)
  })
};

const createSessions = (req, res) =>{
  const { student_id,counselor_id, status , started_at , ended_at} = req.body

  pool.query(
    'INSERT INTO sessions ( student_id, counselor_id, status , started_at , ended_at) VALUES ($1, $2, $3, $4, $5)',
    [ student_id,counselor_id, status , started_at , ended_at], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`student added with ID: ${results.insertId}`)
  })
};

    
export default {
  submitAssessment,
  saveAssessmentAnswer,
  getQuestions,
  createSessions,
}