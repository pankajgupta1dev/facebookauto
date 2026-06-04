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
content: `Generate one ultra-viral AI reel hook.

Rules:

* Maximum 10 words
* Start with an emoji
* Must trigger curiosity, shock, fear, or amazement
* Sound like a secret most people don't know
* One sentence only
* No hashtags
* No quotes
* No explanations

Examples:
😳 AI already knows what you're likely to type next.
🤯 This AI learned skills nobody explicitly taught it.
🚨 AI can create fake videos almost indistinguishable from reality.
🧠 AI can analyze millions of documents in minutes.
🔥 AI is replacing tasks once thought impossible to automate.

Return only the hook.`


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
