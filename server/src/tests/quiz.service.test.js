import { jest } from '@jest/globals';

// Mock לפני import
await jest.unstable_mockModule('../services/gemini.service.js', () => ({
  callGeminiAnalyzeText: jest.fn()
}));

const { generateQuiz } = await import('../services/quiz.service.js');
const { callGeminiAnalyzeText } = await import('../services/gemini.service.js');

callGeminiAnalyzeText.mockResolvedValue({
  questions: ['Q1', 'Q2']
});

test('generateQuiz returns quiz object from Gemini service', async () => {
  const result = await generateQuiz('Some study text');

  expect(result.questions.length).toBe(2);
});
