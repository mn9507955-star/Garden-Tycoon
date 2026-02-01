
import { GoogleGenAI } from "@google/genai";

// Lazy initialization to prevent runtime crashes if API key is missing during module load
let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (ai) return ai;
  
  // Safe access to API key with fallback
  // In Vite, process.env.API_KEY is replaced by the string value from config
  const apiKey = process.env.API_KEY || '';
  
  if (!apiKey) {
    console.warn("Gemini API Key is missing");
    return null;
  }

  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
    return null;
  }
};

export const askGardeningExpert = async (
  query: string, 
  currentMoney: number,
  unlockedPlants: string[]
): Promise<string> => {
  try {
    const client = getAIClient();
    if (!client) return "Hệ thống AI chưa được cấu hình (Thiếu API Key).";
    
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      Bạn là một trợ lý làm vườn vui tính trong game "Garden Tycoon".
      Người chơi hỏi: "${query}".
      
      Ngữ cảnh game:
      - Tiền hiện tại: $${currentMoney}
      - Cây đã mở khóa: ${unlockedPlants.join(', ')}
      
      Hãy trả lời ngắn gọn (dưới 50 từ), vui vẻ, dùng emoji.
      Nếu họ hỏi về kiến thức làm vườn thật, hãy trả lời nhưng liên hệ lại với game.
      Trả lời bằng Tiếng Việt.
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Hiện tại tôi đang bận tưới mây! Thử lại sau nhé.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Mất kết nối với vệ tinh làm vườn. Vui lòng thử lại sau!";
  }
};
