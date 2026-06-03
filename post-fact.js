require('dotenv').config();

const axios = require('axios');
const fs = require('fs');

async function postFact() {

  const fact = fs.readFileSync(
    'fact.txt',
    'utf8'
  );

  const response = await axios.post(
    `https://graph.facebook.com/v25.0/${process.env.PAGE_ID}/feed`,
    {
      message: fact
    },
    {
      params: {
        access_token: process.env.FB_TOKEN
      }
    }
  );

  console.log(response.data);
}

postFact();