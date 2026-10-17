import type { VercelRequest, VercelResponse } from '@vercel/node';
import { solveProblem } from '../_lib/geminiService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { problemText, category = 'General' } = req.body || {};

    if (!problemText || typeof problemText !== 'string' || !problemText.trim()) {
      return res.status(400).json({ error: 'Please enter a valid question or problem.' });
    }

    const result = await solveProblem(problemText, category);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /api/gemini/solve:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while solving the problem.',
      details: error?.message || String(error),
    });
  }
}
