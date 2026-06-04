require('dotenv').config();
const Groq = require("groq-sdk");
const fs = require("fs");

const groq = new Groq({
apiKey: process.env.GROQ_API_KEY
});

async function generateFact() {

const completion =
await groq.chat.completions.create({
model: "llama-3.1-8b-instant",
messages: [
{
role: "system",
content: `You are a viral short-form content creator.

Generate ONE shocking AI fact that makes people stop scrolling.

Rules:
- Maximum 12 words
- Start with an emoji
- Create curiosity and surprise
- Sound unbelievable but true
- No hashtags
- No quotes
- One line only

Examples:
🤖 AI can clone your voice in seconds.
😳 AI detected diseases before doctors noticed symptoms.
🚀 AI writes code faster than most programmers.
🧠 Some AI models remember conversations better than humans.`
},
{
role: "user",
content:
"Generate one shocking AI fact."
}
]
});

const fact =
completion.choices[0].message.content.trim();

fs.writeFileSync("./fact.txt", fact);

return fact;
}

module.exports = { generateFact };
