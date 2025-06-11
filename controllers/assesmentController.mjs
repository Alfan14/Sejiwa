import pool from "../db/index.mjs";

const getQuestions = (req, res, next) => {
    console.log("Hallo dari gettingQuestions")

  pool.query('SELECT * FROM assessment_questions ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

const submitAssessment = async (req, res) => {
  console.log("Hallo dari submitAssessment");
  const { answers } = req.body;

  console.log("Jawaban answer:", answers);

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: "Bad request: empty answers" });
  }

  try {
    // Ambil kode emosi dari semua answer
    const answerCodes = answers.map(a => a.code);
    console.log("Jawaban Code:", answerCodes);

    // 1. Ambil mapping dari database berdasarkan kode emosi
    const results = await pool.query(
      `SELECT ar.recommendation_id, ar.weight, aq.code 
       FROM assessment_recommendations ar
       JOIN assessment_questions aq ON aq.id = ar.question_id
       WHERE aq.code = ANY($1)`,
      [answerCodes]
    );

    // 2. Akumulasi skor berdasarkan recommendation_id
    const scoreMap = {};
    results.rows.forEach(row => {
      if (!scoreMap[row.recommendation_id]) {
        scoreMap[row.recommendation_id] = { score: 0, answers: new Set() };
      }
      scoreMap[row.recommendation_id].score += row.weight;
      scoreMap[row.recommendation_id].answers.add(row.code);
    });

    // 3. Buat mapping dari code ke intensity
    const codeToIntensity = {};
    answers.forEach(ans => {
      codeToIntensity[ans.code] = ans.intensity;
    });

    // 4. Tipe konten berdasarkan intensitas
    const intensityToType = {
      low: 'poster',
      medium: 'article',
      high: 'video',
    };

    // 5. Filter rekomendasi berdasarkan type yang sesuai dengan intensity
    const filteredIds = Object.entries(scoreMap)
      .filter(([id, data]) => {
        const codes = Array.from(data.answers);
        return codes.some(code => {
          const intensity = codeToIntensity[code];
          const expectedType = intensityToType[intensity];
          return expectedType !== undefined;
        });
      })
      .sort((a, b) => b[1].score - a[1].score)
      .map(([id]) => parseInt(id));

    // 6. Ambil detail rekomendasi berdasarkan ID
    const recommendationDetails = await pool.query(
      `SELECT * FROM recommendations WHERE id = ANY($1)`,
      [filteredIds]
    );

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