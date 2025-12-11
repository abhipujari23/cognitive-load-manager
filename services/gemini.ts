import { GoogleGenAI, Type } from "@google/genai";
import { TriageResult, ItemType, Urgency } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a Cognitive Triage Engine. Your goal is to reduce mental load by organizing unstructured thoughts into three categories:
1. TASK: Actionable items. Estimate urgency.
2. DECISION: Choices the user needs to make. Generate a comparison matrix (options, pros, cons) if implied.
3. KNOWLEDGE: Facts, ideas, or references to remember.

Analyze the user's input (text and optional image) and output a structured JSON object.
`;

export const triageInput = async (text: string, imageBase64?: string): Promise<TriageResult> => {
  try {
    const parts: any[] = [{ text }];
    
    if (imageBase64) {
      // Clean base64 string if it contains metadata header
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      parts.unshift({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming jpeg for simplicity in this demo context
          data: cleanBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              enum: [ItemType.TASK, ItemType.DECISION, ItemType.KNOWLEDGE]
            },
            title: { type: Type.STRING, description: "A concise, action-oriented title" },
            summary: { type: Type.STRING, description: "A brief summary or context" },
            urgency: {
              type: Type.STRING,
              enum: [Urgency.HIGH, Urgency.MEDIUM, Urgency.LOW]
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            decisionOptions: {
              type: Type.ARRAY,
              description: "If type is DECISION, populate this. Otherwise empty.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cons: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          },
          required: ["type", "title", "summary", "urgency"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as TriageResult;

  } catch (error) {
    console.error("Gemini Triage Error:", error);
    // Fallback in case of error
    return {
      type: ItemType.KNOWLEDGE,
      title: "Unprocessed Thought",
      summary: text.substring(0, 100) + "...",
      urgency: Urgency.LOW,
      tags: ["error-recovery"]
    };
  }
};