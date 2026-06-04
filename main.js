import 'dotenv/config'; // require('dotenv').config() ki jagah
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import ffmpeg from 'fluent-ffmpeg';
import gTTS from 'gtts';

// Groq file ko import karne ke liye (.js extension lagana zaroori hai)
import { generateFact } from './groq.js'; 

// JSON file ko import karne ke liye asserts/with syntax zaroori hota hai
// import facts from './data/facts.json' assert { type: 'json' };

// FFmpeg Path Setup (ESM compatible)
import ffmpegStatic from 'ffmpeg-static';

let ffmpegPath;
if (fs.existsSync("/usr/bin/ffmpeg")) {
    ffmpegPath = "/usr/bin/ffmpeg";
} else {
    ffmpegPath = ffmpegStatic;
}
ffmpeg.setFfmpegPath(ffmpegPath);

const PAGE_ID = process.env.PAGE_ID;
const TOKEN = process.env.FB_TOKEN;

// ======================
// Generate Voice
// ======================
function generateVoice(text) {
    return new Promise((resolve, reject) => {
        const gtts = new gTTS(text, "en");
        gtts.save("./output/voice.mp3", (err) => {
            if (err) reject(err);
            console.log("✅ Voice Generated");
            resolve();
        });
    });
}

// ======================
// Generate Video
// ======================
function generateVideo() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync("./assets/background.mp4")) {
            reject(new Error("background.mp4 not found inside assets folder"));
            return;
        }

        if (!fs.existsSync("./output")) {
            fs.mkdirSync("./output");
        }

        ffmpeg("./assets/background.mp4")
            .input("./output/voice.mp3")
            .outputOptions([
                "-map 0:v:0",
                "-map 1:a:0",
                "-shortest"
            ])
            .output("./output/video.mp4")
            .on("end", () => {
                console.log("✅ Reel Generated");
                resolve();
            })
            .on("error", reject)
            .run();
    });
}

// ======================
// Upload Video
// ======================
async function uploadVideo(factText) {
    if (!fs.existsSync("./output/video.mp4")) {
        throw new Error("./output/video.mp4 not found");
    }

    const form = new FormData();
    form.append("source", fs.createReadStream("./output/video.mp4"));
    form.append("description", factText);
    form.append("access_token", TOKEN);

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

    console.log("✅ Upload Success");
    console.log(response.data);
}

// ======================
// Main Flow
// ======================
async function main() {
    try {
        const fact = await generateFact();

        console.log("Selected Fact:");
        console.log(fact);

        fs.writeFileSync("fact.txt", fact);

        await generateVoice(fact);

        await generateVideo();

        await uploadVideo(fact);

        console.log("🎉 Complete Process Finished");

    } catch (error) {
        console.error("❌ Process me error aaya:", error);
    }
}

main();