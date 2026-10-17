import type { VercelRequest, VercelResponse } from '@vercel/node';
import { summarizePdf } from '../_lib/geminiService.js';

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
    const body = req.body || {};
    const result = await summarizePdf(body);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /api/gemini/summarize-pdf:', error);
    return res.status(500).json({
      error: 'Failed to summarize the document.',
      details: error?.message || String(error),
    });
  }
}
