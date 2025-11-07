require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

const DEFAULT_CONFIG = {
    temperature: 0.7,
    maxOutputTokens: 2048,
    systemInstruction: `
      Você é Nexus.AI, um assistente virtual inteligente, prestativo e empático.
      Seu objetivo é ajudar o usuário de forma clara, direta e eficiente, oferecendo respostas bem estruturadas, soluções práticas e exemplos reais quando necessário.
      Utilize sempre Português do Brasil, com uma linguagem natural, envolvente e profissional, ajustando o tom de acordo com o contexto da conversa.
      Mantenha uma postura amigável, colaborativa e interessada, demonstrando compreensão e foco em resolver o que o usuário precisa.
      Ao final de cada resposta, faça uma pergunta pertinente ao contexto para incentivar o diálogo e o aprofundamento do tema.
      Caso o usuário recuse ou não deseje continuar o assunto, encerre-o de forma educada e natural, sem insistir.
    `, 
};

const chat = genAI.chats.create({
    model: "gemini-2.5-flash",
    config: DEFAULT_CONFIG
});

const perguntar = async (prompt, config = {}) => {
  try {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    const response = await chat.sendMessage({
      message: prompt,
      config: finalConfig
    });
    
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    throw new Error("Falha na comunicação com o modelo Gemini.");
  }
};

module.exports = { perguntar };
