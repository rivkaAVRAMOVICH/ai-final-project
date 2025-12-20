import request from 'supertest';
import app from '../server.js';
import * as quizService from '../services/quiz.service.js';

// מוקינג של המודול כולו
quizService.generateQuiz = jest.fn().mockResolvedValue({
  questions: ['Mock question 1', 'Mock question 2']
});

describe('POST /api/analyze', () => {
  it('returns quiz', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ text: 'Test text' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.quiz).toBeDefined();
    expect(res.body.quiz.questions).toEqual([
      'Mock question 1',
      'Mock question 2'
    ]);
  });
});
