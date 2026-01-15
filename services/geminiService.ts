import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

export const transcribeAudio = async (file: File): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await fileToBase64(file);

  // Using gemini-2.0-flash-exp for robust multimodal capabilities including audio/video
  // Ideally we would use 'gemini-2.5-flash-native-audio-preview-12-2025' for realtime,
  // but for static file analysis, Flash 2.0 experimental or Flash Latest is excellent.
  // The system prompt advises using mapped names, but here we need specific audio handling.
  // We'll use 'gemini-2.0-flash-exp' as it is a standard powerful model for this, 
  // or fall back to 'gemini-flash-latest' if strictly required. 
  // Given instructions, let's use the explicit mapped name for Flash.
  const modelName = 'gemini-flash-latest'; 

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: `Please provide a highly accurate, verbatim transcription of this audio/video file. 
            
            Rules:
            1. Identify speakers if possible (e.g., Speaker 1:, Speaker 2:).
            2. Ignore filler words like "um", "uh" unless they add meaning.
            3. Use proper punctuation and paragraph breaks.
            4. If the audio is in a language other than English, transcribe it in the original language and then provide an English translation below it.
            5. Return ONLY the transcription text, do not add any conversational preamble like "Here is the transcription:".`
          }
        ]
      }
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("No transcription generated.");
    }
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};
