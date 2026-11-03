import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Server-side Gemini client helper using process.env.GEMINI_API_KEY
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Check API key status endpoint (does NOT expose key to client)
app.get('/api/ai/status', (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');
  res.json({
    configured: isConfigured,
    model: 'gemini-3.8-flash',
    provider: 'Google Gemini'
  });
});

// API endpoint for AI Emergency Triage & Hazard Assessment
app.post('/api/ai/triage', async (req, res) => {
  try {
    const { emergencyType, description, location, victimName } = req.body;
    const ai = getAiClient();

    if (!ai) {
      // Fallback response with heuristic triage when key is not configured yet
      return res.json({
        success: true,
        isSimulated: true,
        analysis: {
          triageLevel: emergencyType === 'Fire' || emergencyType === 'Medical' ? 'Critical' : 'High',
          recommendedTeam:
            emergencyType === 'Fire'
              ? 'Fire Rescue Team'
              : emergencyType === 'Medical'
              ? 'Medical Response Team'
              : emergencyType === 'Natural Disaster'
              ? 'Disaster Taskforce'
              : 'Rescue Team Alpha',
          riskAssessment: `Automated rule-based triage: Acute distress reported at ${location}. Immediate scene hazards and potential escalation require priority responder dispatch.`,
          immediateActions: [
            'Dispatch nearest specialized rescue unit to verified GPS coordinates',
            'Maintain continuous socket link with reporting device',
            'Notify nearest trauma center or fire brigade sector depot',
            'Instruct victim to move away from immediate hazard vectors if safely possible'
          ],
          specializedEquipment: [
            emergencyType === 'Medical' ? 'Advanced Cardiac Defibrillator (AED)' : 'Hydraulic Cutting Tool',
            'Rapid Emergency Trauma Kit',
            'Thermal Imaging Unit'
          ]
        }
      });
    }

    const prompt = `You are the lead AI Emergency Dispatch & Triage Specialist for Rescue-Net. Analyze this distress report:
Victim: ${victimName || 'Citizen'}
Emergency Category: ${emergencyType || 'General'}
Location: ${location || 'Alandi / Pune'}
Distress Details: "${description || 'Urgent assistance required'}"

Return a valid JSON object with the following schema:
{
  "triageLevel": "Critical" | "High" | "Medium",
  "recommendedTeam": "Medical Response Team" | "Fire Rescue Team" | "Rescue Team Alpha" | "Rescue Team Bravo" | "Disaster Taskforce",
  "riskAssessment": "2-3 crisp sentences detailing life safety hazards, severity, and rapid scene precautions.",
  "immediateActions": ["Action 1", "Action 2", "Action 3", "Action 4"],
  "specializedEquipment": ["Gear 1", "Gear 2", "Gear 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      isSimulated: false,
      analysis: parsed
    });
  } catch (error: any) {
    console.error('Gemini API triage error:', error);
    return res.status(200).json({
      success: false,
      error: error.message || 'AI Triage processing failed',
      analysis: {
        triageLevel: 'High',
        recommendedTeam: 'Rescue Team Alpha',
        riskAssessment: 'AI triage service encountered a transient exception. Fallback triage applied.',
        immediateActions: ['Dispatch nearest unit immediately', 'Confirm patient vitals manually'],
        specializedEquipment: ['First Aid Trauma Kit']
      }
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
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Rescue-Net server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
