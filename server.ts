import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { solveProblem, summarizePdf } from './api/_lib/geminiService.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Generous body limit for PDF / notes payload
app.use(express.json({ limit: '25mb' }));

// Health check endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'EngiNotes Local & Cloud API',
    status: 'healthy',
    version: '1.0.0',
    endpoints: [
      'POST /api/gemini/solve',
      'POST /api/gemini/summarize-pdf',
      'POST /api/gemini/last-minute-notes',
    ],
  });
});

// Server API route for Brahmastra AI Solver
app.post('/api/gemini/solve', async (req: Request, res: Response) => {
  try {
    const { problemText, category = 'General' } = req.body || {};

    if (!problemText || typeof problemText !== 'string' || !problemText.trim()) {
      return res.status(400).json({ error: 'Please enter a valid question or problem.' });
    }

    const result = await solveProblem(problemText, category);
    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/gemini/solve:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while solving the problem.',
      details: error?.message || String(error),
    });
  }
});

// Endpoint for Smart PDF & Textbook Summarizer
app.post('/api/gemini/summarize-pdf', async (req: Request, res: Response) => {
  try {
    const result = await summarizePdf(req.body || {});
    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/gemini/summarize-pdf:', error);
    return res.status(500).json({
      error: 'Failed to summarize the document.',
      details: error?.message || String(error),
    });
  }
});

// Alias endpoint for Last Minute Notes tool
app.post('/api/gemini/last-minute-notes', async (req: Request, res: Response) => {
  try {
    const result = await summarizePdf(req.body || {});
    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/gemini/last-minute-notes:', error);
    return res.status(500).json({
      error: 'Failed to generate last minute notes.',
      details: error?.message || String(error),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EngiNotes server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
