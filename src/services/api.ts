import axios from 'axios';

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

export interface FridgeAnalysis {
  score: number;
  personalityType: string;
  personalityEmoji: string;
  roast: string;
  positives: string[];
  recipes: { name: string; description: string }[];
}

export async function analyzeFridge(base64Image: string): Promise<FridgeAnalysis> {
  const prompt = `You are a witty fridge analyst. Analyze this fridge photo and respond ONLY with valid JSON in this exact format:
{
  "score": <number 1-10>,
  "personalityType": "<funny fridge personality like 'The Condiment Hoarder' or 'The Sad Bachelor'>",
  "personalityEmoji": "<single emoji that matches the personality>",
  "roast": "<one funny, savage but lighthearted sentence roasting this fridge>",
  "positives": ["<one good thing>", "<another good thing>"],
  "recipes": [
    { "name": "<recipe name>", "description": "<one sentence description using visible ingredients>" },
    { "name": "<recipe name>", "description": "<one sentence description using visible ingredients>" }
  ]
}`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: 'low',
              },
            },
            { type: 'text', text: prompt },
          ],
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = response.data.choices[0].message.content;
  // Strip markdown code fences if present
  const cleaned = content.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as FridgeAnalysis;
}
