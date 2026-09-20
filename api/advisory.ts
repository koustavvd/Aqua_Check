import { GoogleGenAI } from '@google/genai';
import { generateHydrogeologicalAdvisory } from '../src/utils/advisoryGenerator';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // ignore
      }
    }
    const { station, lang } = body || {};
    if (!station) {
      return res.status(400).json({ error: 'Station data is required' });
    }

    const ai = getAiClient();
    if (ai) {
      const isBengali = lang === 'bn';
      const isHindi = lang === 'hi';
      let languageInstruction = 'Provide the response in English.';
      if (isBengali) {
        languageInstruction = 'IMPORTANT: Write the entire response strictly in formal Bengali (বাংলা).';
      } else if (isHindi) {
        languageInstruction = 'IMPORTANT: Write the entire response strictly in formal Hindi (हिन्दी).';
      }

      const prompt = `You are a Senior Hydrogeologist at the Central Ground Water Board (CGWB) specializing in Tripura, India.
Analyze this station:
- Station: ${station.location} (ID: #${station.id})
- District: ${station.district}, Block: ${station.block}
- Type: ${station.type}
- Pre-monsoon Depth: ${station.pre_depth} mbgl
- Annual Trend: ${station.trend_fall > 0 ? `Fall ${station.trend_fall} m/yr` : `Rise ${station.trend_rise} m/yr`}
- Formation/Terrain: ${station.terrain}
${languageInstruction}

Provide JSON with:
{
  "formationAnalysis": "2-3 sentences explaining stratigraphy",
  "preDrillingAdvice": ["Advice 1", "Advice 2", "Advice 3"],
  "contractorQuestions": ["Question 1", "Question 2", "Question 3"],
  "waterQualityNotes": "Water quality note regarding iron Fe or pH",
  "riskAssessment": {
    "level": "${station.risk < 30 ? 'Low' : station.risk < 50 ? 'Moderate' : 'High'}",
    "rationale": "Clear technical rationale",
    "recommendedDepth": "Depth range in meters"
  }
}
Output raw JSON only.`;

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      for (const modelName of candidateModels) {
        try {
          const aiRes = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: 'application/json' },
          });
          const text = aiRes.text?.trim();
          if (text) {
            const parsed = JSON.parse(text);
            return res.status(200).json({ ...parsed, modelUsed: modelName, isLiveAi: true });
          }
        } catch {
          continue;
        }
      }
    }

    // Deterministic hydrogeological calculations
    const fallback = generateHydrogeologicalAdvisory(station, lang);
    return res.status(200).json(fallback);
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
