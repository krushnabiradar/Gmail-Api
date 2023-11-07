const express = require("express");
const app = express();
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const port = 8080;
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/",
];
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

app.get("/", async (req, res) => {
  try {
    const auth = await authenticate({
      keyfilePath: CREDENTIALS_PATH,
      scopes: SCOPES,
    });

    const gmail = google.gmail({ version: "v1", auth });

    res.json({ Auth: auth });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
