require('dotenv').config();

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const PAGE_ID = process.env.PAGE_ID;
const TOKEN = process.env.FB_TOKEN;

console.log("PAGE_ID:", PAGE_ID);
console.log(
"TOKEN:",
TOKEN ? "Loaded Successfully ✅" : "Not Loaded ❌"
);

async function uploadVideo() {
try {
// Video exists?
if (!fs.existsSync("./output/video.mp4")) {
console.error("❌ Video file not found: ./output/video.mp4");
return;
}

// Read generated fact if available
let description = "🤖 Auto AI Fact Video";

if (fs.existsSync("./output/fact.txt")) {
  description = fs.readFileSync(
    "./output/fact.txt",
    "utf8"
  );
}

const form = new FormData();

form.append(
  "source",
  fs.createReadStream("./output/video.mp4")
);

form.append(
  "description",
  description
);

form.append(
  "access_token",
  TOKEN
);

console.log("🚀 Uploading video to Facebook...");

const response = await axios.post(
  `https://graph-video.facebook.com/v25.0/${PAGE_ID}/videos`,
  form,
  {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  }
);

console.log("✅ Upload Success!");
console.log(response.data);

} catch (error) {

console.error("❌ Upload Failed");

if (error.response) {
  console.error(
    "Facebook Error:",
    error.response.data
  );
} else {
  console.error(
    "General Error:",
    error.message
  );
}

}
}

uploadVideo();