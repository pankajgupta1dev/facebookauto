require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

async function generateFact() {

  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
  });

  const prompt = `
Generate ONE viral AI fact.

Rules:
- English
- Maximum 40 words
- Surprising
- Add emoji
- End with:
Follow Pixel Robo AI for more facts 🚀
`;

  const result = await model.generateContent(prompt);

  const fact = result.response.text();

  fs.writeFileSync("fact.txt", fact);

  console.log(fact);
}

generateFact();