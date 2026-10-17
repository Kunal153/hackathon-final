import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    name: 'EngiNotes API Engine',
    status: 'healthy',
    version: '1.0.0',
    endpoints: [
      'POST /api/gemini/solve',
      'POST /api/gemini/summarize-pdf',
      'POST /api/gemini/last-minute-notes'
    ]
  });
}
