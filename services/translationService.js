// services/translationService.js
const { openai } = require('../config/openai');

exports.translateText = async (text, targetLanguage) => {
    if (!text) return "";

    try {
        console.log(`[TRANSLATE] "${text}" → ${targetLanguage}`); // ✅ log awal

        const response = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { 
                    role: "system", 
                    content: "You are a professional translation assistant. Translate any given text into the target language specified by the user. Automatically detect the source language, including support for Indonesian regional languages such as Javanese, Sundanese, Bataknese, Minangkabau, etc. Use natural, context-aware, and culturally appropriate diction and idiomatic expressions in the target language. Ensure translations are accurate, fluent, and localized. Do not provide any explanations, definitions, or commentary—only the final translation." 
                },
                { 
                    role: "user", 
                    content: `Translate to ${targetLanguage}: "${text}"` 
                }
            ],
            temperature: 0.3,
        });

        const translated = response.choices[0].message.content.trim();

        console.log(`[RESPONSE] ${translated}`); // ✅ log hasil terjemahan

        return translated;

    } catch (error) {
        console.error("❌ Kesalahan saat translasi:", error.response?.data || error.message); // ✅ log error yang lebih informatif
        return text; // fallback jika gagal
    }
};
