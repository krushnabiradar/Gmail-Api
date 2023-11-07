const { google } = require("googleapis");

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

//  Function to create sample Mail and auto send reply
async function sendAutoReply(auth, gmail, email, labelId, message) {
  const replyMessage = {
    userId: "me",
    resource: {
      raw: Buffer.from(
        `To: ${
          email.payload.headers.find((header) => header.name === "From").value
        }\r\n` +
          `Subject: Re: ${
            email.payload.headers.find((header) => header.name === "Subject")
              .value
          }\r\n` +
          `Content-Type: text/plain; charset="UTF-8"\r\n` +
          `Content-Transfer-Encoding: 7bit\r\n\r\n` +
          `Thank you for your email. I'm currently on vacation and will get back to you ASAP.\r\n`
      ).toString("base64"),
    },
  };

  await gmail.users.messages.send(replyMessage);

  await gmail.users.messages.modify({
    auth,
    userId: "me",
    id: message.id,
    resource: {
      addLabelIds: [labelId],
      removeLabelIds: ["INBOX"],
    },
  });
}

module.exports = { unRepliedMessages, createLabel, sendAutoReply };
