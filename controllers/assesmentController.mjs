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
  const answers  = req.body;

  console.log("Jawaban answer:",answers)

  if (!answers || answers.length === 0) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    // Ambil kode emosi dari semua answer
    const codes = answers.map(a => a.code);
    console.log("Jawaban Code:",codes)

    // 1. Ambil mapping dari database berdasarkan kode emosi
    const results = await pool.query(
      `SELECT ar.recommendation_id, ar.weight 
           FROM assessment_recommendations ar
           JOIN assessment_questions aq ON aq.id = ar.question_id
           WHERE aq.code = ANY($1)`,
      [codes]
    );

    //  2. Akumulasi skor berdasarkan recommendation_id
    const scoreMap = {};
    results.rows.forEach(row => {
      if (!scoreMap[row.recommendation_id]) {
        scoreMap[row.recommendation_id] = 0;
      }
      scoreMap[row.recommendation_id].score += row.weight;
      scoreMap[row.recommendation_id].codes.add(row.code);
    });

    // 3. Ambil mapping dari emosi ke intensity dari submittedAnswers
    const codeToIntensity = {};
    answers.forEach(ans => {
      codeToIntensity[ans.code] = ans.intensity;
    });


    // 3. Urutkan berdasarkan skor tertinggi
    const sortedRecommendations = Object.entries(scoreMap)
      .sort((a, b) => b[1] - a[1]) // Urutkan berdasarkan skor
      .map(entry => parseInt(entry[0])); // Ambil ID rekomendasi

    // 4. Dapatkan tipe konten berdasarkan intensitas
    const intensityToType = {
      low: 'poster',
      medium: 'article',
      high: 'video',
    };

    // 5. Ambil recommendation_id yg sesuai type
    const filteredIds = Object.entries(scoreMap)
      .filter(([id, data]) => {
        const codes = Array.from(data.codes);
        // cocokkan semua code dengan type yang benar
        return codes.some(code => {
          const intensity = codeToIntensity[code];
          const expectedType = intensityToType[intensity];
          return expectedType !== undefined; // hanya jika cocok
        });
      })
      .sort((a, b) => b[1].score - a[1].score) // sort by score
      .map(([id]) => parseInt(id));


    // 4. Ambil detail rekomendasi berdasarkan ID yang diurutkan
    const recommendationDetails = await pool.query(
      `SELECT * FROM recommendations WHERE id = ANY($1)`,
      [filteredIds]
    );
    // Kirim hasil ke pelajar
    res.status(200).json({ recommendations: recommendationDetails.rows });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const saveAssessmentAnswer = (req, res) => {
  const { student_id, question_code, submitted_at } = req.body

  pool.query(
    'INSERT INTO assessment_answers ( student_id, question_code , submitted_at) VALUES ($1, $2, $3)',
    [student_id, question_code, submitted_at], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`student added with ID: ${results.insertId}`)
    })
};

const createSessions = (req, res) => {
  const { student_id, counselor_id, status, started_at, ended_at } = req.body

  pool.query(
    'INSERT INTO sessions ( student_id, counselor_id, status , started_at , ended_at) VALUES ($1, $2, $3, $4, $5)',
    [student_id, counselor_id, status, started_at, ended_at], (error, results) => {
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