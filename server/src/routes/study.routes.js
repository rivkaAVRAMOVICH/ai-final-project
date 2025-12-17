import express from 'express';

import {
  analyzeText,
  submitAnswers
} from '../controllers/study.controller.js';

const router = express.Router();

router.post('/analyze', analyzeText);
router.post('/submit', submitAnswers);

export default router;