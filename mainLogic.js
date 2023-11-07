// mainLogic.js
const {
    unRepliedMessages,
    createLabel,
    sendAutoReply,
  } = require("./gmailUtils");
  
  async function mainLogic(auth, gmail) {
    const labelId = await createLabel(auth, gmail);
  
    //    Set time interval for cheking for unreplied mails and sending mail every 45-120 sec
  
    setInterval(async () => {
      const messages = await unRepliedMessages(auth, gmail);
      if (messages && messages.length > 0) {
        for (const message of messages) {
          const messageData = await gmail.users.messages.get({
            auth,
            userId: "me",
            id: message.id,
          });
  
          const email = messageData.data;
          const hasReplied = email.payload.headers.some(
            (header) => header.name === "In-Reply-To"
          );
  
          if (!hasReplied) {
            await sendAutoReply(auth, gmail, email, labelId, message);
          }
        }
      }
    }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000);
  }
  
  module.exports = mainLogic;
  