import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const getGeminiResponse = async (
  userPrompt: string,
  history: { role: 'user' | 'model', text: string }[]
) => {
  if (!API_KEY) {
    return "خطأ: لم يتم تهيئة مفتاح API بشكل صحيح.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const chat = ai.chats.create({
      model: "gemini-1.5-flash",
      config: {
        systemInstruction: `أنت مساعد أكاديمي خبير ومتخصص في علم النفس الدينامي...`
      }
    });

    const response = await chat.sendMessage({
      message: userPrompt
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "عذراً، حدث خطأ أثناء الاتصال بالمعلم الذكي. يرجى المحاولة لاحقاً.";
  }
};
- عند سؤالك عن مصطلح، ابدأ بتعريفه ثم اشرح أهميته في سياق علم النفس الدينامي.
- إذا سألك الطالب عن رأي شخصي، وجهه دائماً نحو الآراء العلمية المذكورة في المنهج.
- كن مشجعاً للطلاب ومحفزاً لهم على التفكير النقدي.`,
      }
    });

    const response = await chat.sendMessage({ message: userPrompt });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "عذراً، حدث خطأ أثناء الاتصال بالمعلم الذكي. يرجى المحاولة لاحقاً.";
  }
};
