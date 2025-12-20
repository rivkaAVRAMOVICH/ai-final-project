import express from 'express';

import {
  analyzeText,
} from '../controllers/study.controller.js';

const router = express.Router();

router.post('/analyze', analyzeText);

export default router;