import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePropertyDescription = async (
  title: string,
  type: string,
  location: string,
  features: string[]
): Promise<string> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return "Beautiful property in a great location. Contact for more details.";
  }

  try {
    const prompt = `
      Write a compelling, professional, and attractive real estate listing description (approx 80-100 words) for a property with the following details:
      Title: ${title}
      Type: ${type}
      Location: ${location}
      Key Features: ${features.join(', ')}.

      Tone: Sophisticated, inviting, and trustworthy. Focus on the lifestyle and benefits.
      Do not include placeholders.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Contact us for more details about this wonderful property.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "A stunning property located in a prime area. Perfect for families or professionals looking for a new home.";
  }
};
