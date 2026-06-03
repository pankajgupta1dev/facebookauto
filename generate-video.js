const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

const facts = require("./data/facts.json");

const fact =
  facts[Math.floor(Math.random() * facts.length)];

console.log("Selected Fact:", fact);

ffmpeg("assets/background.mp4")
  .videoFilters([
    {
      filter: "drawtext",
      options: {
        text: fact,
        fontsize: 40,
        fontcolor: "white",
        x: "(w-text_w)/2",
        y: "(h-text_h)/2"
      }
    }
  ])
  .output("output/video.mp4")
  .on("end", () => {
    console.log("Video Generated ✅");
  })
  .run();