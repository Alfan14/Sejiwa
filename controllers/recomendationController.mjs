import pool from "../db/index.mjs";

const recommendation_answer = async (req, res) => {
    try {
        // Fetch recommendations based on matching question codes
        const result = await pool.query(`
        SELECT r.*
        FROM assessment_questions q
        JOIN assessment_recommendations ar ON q.id = ar.question_id
        JOIN recommendations r ON r.id = ar.recommendation
        WHERE q.code = ANY($1)
        ORDER BY ar.weight DESC;
        `, [answers]);

        res.json({ recommendations: result.rows });
    } catch (err) {
        console.error('Failed to get recommendations', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default {recommendation_answer};