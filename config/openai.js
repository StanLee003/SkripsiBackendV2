// config/openai.js


const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: "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", 
});

console.log('✅ OpenAI client siap digunakan.');

module.exports = { openai };