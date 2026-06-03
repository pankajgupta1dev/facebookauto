const fs = require("fs");
const { google } = require("googleapis");

async function uploadVideo() {

  const credentials = require("./client_secret.json");
  const token = require("./token.json");

  const { client_secret, client_id } =
    credentials.installed;

  const oauth2Client =
    new google.auth.OAuth2(
      client_id,
      client_secret,
      "http://localhost"
    );

  oauth2Client.setCredentials(token);

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title:
          "🤖 AI Fact Shorts #" +
          Math.floor(Math.random() * 10000),

        description:
          "Daily AI Facts 🚀 #shorts #ai #artificialintelligence",

        tags: [
          "AI",
          "Shorts",
          "Technology",
        ],

        categoryId: "28",
      },

      status: {
        privacyStatus: "public",
      },
    },

    media: {
      body: fs.createReadStream(
        "./output/video.mp4"
      ),
    },
  });

  console.log(
    "✅ Uploaded Successfully"
  );

  console.log(response.data.id);
}

uploadVideo().catch(console.error);