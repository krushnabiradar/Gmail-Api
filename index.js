const express = require("express");
const app = express();
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const port = 8080;

app.get("/", async (req, res) => {});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
