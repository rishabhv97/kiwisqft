import { GoogleGenerativeAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generatePropertyDescription = async (propertyDetails: string) => {
  if (!API_KEY) {
    console.error("Gemini API Key is missing");
    return "AI description unavailable (Missing API Key).";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Write a professional and attractive real estate description for a property with these details: ${propertyDetails}. Keep it under 150 words.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error generating description. Please try again.";
  }
};