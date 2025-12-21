import express from 'express';

import {
  analyzeMultipleChoice,
  analyzeTrueFalse,
  //
  // analyzeText,
  // submitAnswers
} from '../controllers/study.controller.js';

const router = express.Router();

// router.post('/analyze', analyzeText);
// router.post('/submit', submitAnswers);

router.post('/quiz/multiple-choice', analyzeMultipleChoice);
router.post('/quiz/true-false', analyzeTrueFalse);




export default router;