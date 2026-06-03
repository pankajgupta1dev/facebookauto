require('dotenv').config();
const axios = require('axios');

async function testPost() {
  const res = await axios.post(
    `https://graph.facebook.com/v25.0/${process.env.PAGE_ID}/feed`,
    {
      message: "Hello from Node.js 🚀"
    },
    {
      params: {
        access_token: process.env.FB_TOKEN
      }
    }
  );

  console.log(res.data);
}

testPost().catch(console.error);