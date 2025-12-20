import express from 'express';

import {
  startRolePlay,
  sendRolePlayMessage,
} from '../controllers/rolePlay.controller.js';

const router = express.Router();

router.post('/', startRolePlay);
router.post('/message', sendRolePlayMessage);


export default router;