require('dotenv').config();

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const PAGE_ID = process.env.PAGE_ID;
const TOKEN = process.env.FB_TOKEN;

console.log('PAGE_ID:', PAGE_ID);
console.log('TOKEN Loading:', TOKEN ? 'Loaded Successfully ✅' : 'Not Loaded ❌');

async function uploadVideo() {
  try {
    if (!fs.existsSync("./videos/video.mp4")) {
      console.error("Error: ./videos/video.mp4 file nahi mili! Sahi path check karo.");
      return;
    }

    const form = new FormData();

    form.append(
      "source",
      fs.createReadStream("./videos/video.mp4")
    );

    form.append(
      "description",
      "Auto uploaded from GitHub Actions 🚀"
    );

    form.append(
      "access_token",
      TOKEN
    );

    console.log("Uploading video... thoda time lag sakta hai...");

    const response = await axios.post(
      `https://graph-video.facebook.com/v19.0/${PAGE_ID}/videos`,
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    console.log("Upload Success! Response Data:", response.data);
  } catch (error) {
    console.error("Upload Failed ❌");
    if (error.response) {
      console.error("FB API Error:", error.response.data);
    } else {
      console.error("General Error:", error.message);
    }
  }
}

uploadVideo();