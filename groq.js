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
content: `AI के बारे में एक ऐसा तथ्य लिखो जो लोगों को "सच में?" कहने पर मजबूर कर दे।

नियम:

* अधिकतम 10 शब्द
* शुरुआत इमोजी से
* डर, आश्चर्य या उत्साह पैदा करे
* सरल हिंदी में हो
* केवल एक लाइन

उदाहरण:
😱 AI आपकी आवाज़ बनकर किसी से भी बात कर सकता है।
🤖 AI आपकी अगली बात का अंदाज़ा लगा सकता है।
🚨 AI कुछ सेकंड में नकली वीडियो बना सकता है।
🧠 AI लाखों किताबें घंटों में पढ़ सकता है।`

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
