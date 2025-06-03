import express from 'express';
import recomendation from '../../controllers/recomendationController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.post('/recommendations',recomendation.recommendation_answer, async (req, res) => {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid answers format' });
        }
    }
)
router.get('/recommendations', recomendation.recommendation_answer , async (req, res) => {
  let answers;
  try {
    answers = JSON.parse(req.query.answers);
    if (!Array.isArray(answers)) throw new Error();
  } catch {
    return res.status(400).json({ error: 'Invalid query param: answers[]' });
  }
});

export default router;