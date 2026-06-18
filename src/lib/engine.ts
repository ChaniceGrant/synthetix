import { GoogleGenerativeAI } from "@google/generative-ai";
import { DesignTokens, defaultTokens } from "./tokens";

export async function generateDesignSystem(prompt: string): Promise<DesignTokens> {
  console.log("Generating design system for prompt:", prompt);
  console.log("API Key present:", !!process.env.GEMINI_API_KEY);
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is MISSING in process.env");
    return defaultTokens;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Use the stable 'v1' version instead of 'v1beta'
  const model = genAI.getGenerativeModel(
    { model: "gemini-1.5-flash" },
    { apiVersion: "v1" }
  );

  const systemPrompt = `
    You are a professional brand designer and UI/UX engineer. 
    Convert the following branding guidelines into a JSON object of design tokens.
    Follow this exact TypeScript interface:

    interface DesignTokens {
      colors: {
        primary: string; // hex
        secondary: string; // hex
        accent: string; // hex
        background: string; // hex
        foreground: string; // hex
        muted: string; // hex
        border: string; // hex
      };
      typography: {
        fontFamily: string; // e.g., 'Inter, sans-serif'
        headingFontFamily: string;
        baseFontSize: string; // e.g., '16px'
        borderRadius: string; // e.g., '0.5rem'
      };
      visuals: {
        shadow: string; // CSS shadow value
        vibe: 'minimal' | 'playful' | 'brutalism' | 'corporate' | 'futuristic';
        animationSpeed: number; // 0.1 to 2
      };
      threeJs: {
        geometry: 'box' | 'sphere' | 'torus' | 'icosahedron';
        material: 'standard' | 'physical' | 'normal';
        complexity: number; // 1 to 10
      };
    }

    Rules:
    - Return ONLY the JSON object.
    - No markdown formatting.
    - Guidelines: "${prompt}"
  `;

  try {
    const result = await model.generateContent(systemPrompt);
    const text = result.response.text().trim();
    
    // Extract JSON using regex in case there's preamble or postamble
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    return JSON.parse(jsonMatch[0]) as DesignTokens;
  } catch (error) {
    console.error("Failed to generate design system:", error);
    return defaultTokens;
  }
}
