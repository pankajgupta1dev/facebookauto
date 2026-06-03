require('dotenv').config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const ffmpeg = require("fluent-ffmpeg");

let ffmpegPath;
try {
    if (require("fs").existsSync("/usr/bin/ffmpeg")) {
        ffmpegPath = "/usr/bin/ffmpeg";
    } else {
        ffmpegPath = require("ffmpeg-static");
    }
} catch (e) {
    ffmpegPath = require("ffmpeg-static");
}
ffmpeg.setFfmpegPath(ffmpegPath);

const PAGE_ID = process.env.PAGE_ID;
const TOKEN = process.env.FB_TOKEN;

// ======================
// Generate Fact
// ======================

const facts = require("./data/facts.json");

const fact =
facts[Math.floor(Math.random() * facts.length)];

console.log("Selected Fact:");
console.log(fact);

fs.writeFileSync("fact.txt", fact);

// ======================
// Generate Video
// ======================

function generateVideo() {

return new Promise((resolve, reject) => {

if (!fs.existsSync("./assets/background.mp4")) {

  reject(
    new Error(
      "background.mp4 not found inside assets folder"
    )
  );

  return;
}

if (!fs.existsSync("./output")) {
  fs.mkdirSync("./output");
}

ffmpeg("./assets/background.mp4")
.videoFilters([
  {
    filter: "drawtext",
    options: {
      text: fact,
      fontsize: 40,
      fontcolor: "white",
      // Linux/Ubuntu par default font path taaki fail na ho
      fontfile: "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 
      x: "(w-text_w)/2",
      y: "(h-text_h)/2"
    }
  }
])
  .output("./output/video.mp4")
  .on("end", () => {

    console.log("✅ Video Generated");

    resolve();
  })
  .on("error", (err) => {

    reject(err);
  })
  .run();

});
}

// ======================
// Upload Video
// ======================

async function uploadVideo() {

if (!fs.existsSync("./output/video.mp4")) {

throw new Error(
  "./output/video.mp4 not found"
);

}

const form = new FormData();

form.append(
"source",
fs.createReadStream("./output/video.mp4")
);

form.append(
"description",
fact
);

form.append(
"access_token",
TOKEN
);

console.log(
"🚀 Uploading video to Facebook..."
);

const response = await axios.post(
  `https://graph-video.facebook.com/v25.0/${PAGE_ID}/videos`,
form,
{
headers: form.getHeaders(),
maxContentLength: Infinity,
maxBodyLength: Infinity
}
);

console.log("✅ Upload Success");
console.log(response.data);
}

// ======================
// Main Flow
// ======================

async function main() {

try {

await generateVideo();

await uploadVideo();

console.log(
  "🎉 Complete Process Finished"
);

} catch (error) {

console.error("❌ Failed");

if (error.response) {
  console.error(error.response.data);
} else {
  console.error(error.message);
}

}
}

main();