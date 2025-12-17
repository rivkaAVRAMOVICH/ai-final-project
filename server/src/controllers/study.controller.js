import { generateQuiz } from '../services/quiz.service.js';
import { gradeAnswers } from '../services/grading.service.js';

export async function analyzeText(req, res) {
  try {
     console.log("Request body:", req.body);
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const quiz = await generateQuiz(text);

    res.json({ quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
}

export async function submitAnswers(req, res) {
  try {
    const { questions, answers } = req.body;

    if (!questions || !answers) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const result = await gradeAnswers(questions, answers);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to grade answers' });
  }
}
