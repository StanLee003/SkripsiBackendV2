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
                    content: "Translate the given text based on the language provided by the user, identify the language used, and select suitable diction and idiomatic expressions for accurate translation, including recognizing Indonesian regional languages, without providing explanations." 
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