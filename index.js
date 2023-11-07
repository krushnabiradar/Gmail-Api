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

//  function to get unreplied mails/messages
async function unRepliedMessages(auth, gmail) {
  const response = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    q: "is:unread",
  });
  return response.data.messages || [];
}

// Function to create new lable for auto reply messages
const labelName = "Auto-Reply";
async function createLabel(auth, gmail) {
  try {
    const response = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: labelName,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    return response.data.id;
  } catch (error) {
    if (error.code === 409) {
      const response = await gmail.users.labels.list({
        userId: "me",
      });
      const label = response.data.labels.find(
        (label) => label.name === labelName
      );
      return label.id;
    } else {
      throw error;
    }
  }
}


//  Function to create Mail and auto send reply



//  main function to call all function 
async function mainLogic(auth, gmail) {
  const labelId = await createLabel(auth, gmail);

//    Set time interval for cheking and sending mail every 45-120 sec
 
}

app.get("/", async (req, res) => {
  try {
    const auth = await authenticate({
      keyfilePath: CREDENTIALS_PATH,
      scopes: SCOPES,
    });

    const gmail = google.gmail({ version: "v1", auth });

    // Call the main logic function
    await mainLogic(auth, gmail);

    res.json({ Auth: auth });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
