import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator for custom quizzes if offline or key is missing
function generateFallbackQuiz(topic: string) {
  return {
    title: `Custom Geography Quiz: ${topic || 'World Wonders'}`,
    description: `Test your mastery on ${topic || 'global geography and wonders'}.`,
    questions: [
      {
        id: 1,
        question: `Which country is most famously associated with or contains key features of ${topic || 'this region'}?`,
        options: ['Brazil', 'Indonesia', 'Iceland', 'Norway'],
        correctIndex: 2,
        explanation: 'Iceland has unique tectonic boundaries and dramatic geographic landscapes.'
      },
      {
        id: 2,
        question: 'Which of the following is the world’s largest landlocked country by land area?',
        options: ['Mongolia', 'Kazakhstan', 'Chad', 'Bolivia'],
        correctIndex: 1,
        explanation: 'Kazakhstan covers over 2.7 million square kilometers, making it the largest landlocked nation.'
      },
      {
        id: 3,
        question: 'Which strait separates Europe from Africa at its narrowest point (approx. 14.3 km / 8.9 miles)?',
        options: ['Strait of Malacca', 'Bosphorus Strait', 'Strait of Gibraltar', 'Bering Strait'],
        correctIndex: 2,
        explanation: 'The Strait of Gibraltar connects the Atlantic Ocean to the Mediterranean Sea and separates Spain from Morocco.'
      },
      {
        id: 4,
        question: 'What is the highest capital city in the world by elevation above sea level?',
        options: ['Quito, Ecuador', 'La Paz, Bolivia', 'Bogotá, Colombia', 'Addis Ababa, Ethiopia'],
        correctIndex: 1,
        explanation: 'La Paz sits at approximately 3,640 meters (11,942 ft) above sea level.'
      },
      {
        id: 5,
        question: 'Which river flows through the most sovereign countries in the world (10 countries)?',
        options: ['Amazon', 'Rhine', 'Danube', 'Nile'],
        correctIndex: 2,
        explanation: 'The Danube flows through Germany, Austria, Slovakia, Hungary, Croatia, Serbia, Romania, Bulgaria, Moldova, and Ukraine.'
      }
    ]
  };
}

// API: Generate Custom Quiz via Gemini
app.post('/api/generate-geo-quiz', async (req, res) => {
  const { topic, difficulty = 'medium', questionCount = 5 } = req.body;

  if (ai) {
    try {
      const prompt = `You are a world-class geography professor and trivia designer. Generate a thrilling, highly accurate ${questionCount}-question multiple choice quiz on the topic: "${topic || 'General World Geography'}". Difficulty level: ${difficulty}.

Requirements:
- Questions must be factually exact and engaging.
- Exactly 4 choices per question.
- Exactly one correct answer with its 0-indexed position.
- Include a fascinating 1-sentence educational explanation for each answer.

Format your response strictly as JSON with this schema:
{
  "title": "Short exciting title",
  "description": "1 sentence description",
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is correct and an intriguing fact."
    }
  ]
}

Ensure the output is ONLY valid JSON with no markdown wrapping.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const quiz = JSON.parse(cleaned);
        return res.json(quiz);
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, using fallback quiz:', err?.message || err);
    }
  }

  return res.json(generateFallbackQuiz(topic));
});

// API: Country Trivia & Flag Fact Generator
app.post('/api/country-fact', async (req, res) => {
  const { countryName } = req.body;
  if (!countryName) {
    return res.status(400).json({ error: 'Country name is required' });
  }

  if (ai) {
    try {
      const prompt = `Provide 3 mind-blowing geographic and flag facts about the country "${countryName}". 
Include:
1. One unique geographical record or physical wonder.
2. The symbolism and history behind its national flag.
3. One quirky border, geopolitical, or territorial curiosity.

Format as JSON:
{
  "country": "${countryName}",
  "geoFact": "fact string",
  "flagSymbolism": "fact string",
  "quirk": "fact string"
}
Ensure output is ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    } catch (err) {
      // Fallback below
    }
  }

  return res.json({
    country: countryName,
    geoFact: `${countryName} boasts distinctive topography, cultural heritage, and geographical positioning.`,
    flagSymbolism: `The colors and geometry of ${countryName}'s flag reflect national unity, historical heritage, and regional landscapes.`,
    quirk: `Explored by cartographers and geographers through centuries of world history.`
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, port: Number(PORT), host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
