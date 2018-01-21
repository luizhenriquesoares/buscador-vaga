const TelegramBot = require("node-telegram-bot-api");
const githubController = require("../controllers/github.controller");
const { dataTelegram } = require("../telegram/api");

//create new bot
function createNewBot(token) {
  return new TelegramBot(token, { polling: true });
}

function init() {
  const bot = createNewBot(dataTelegram.token);

  bot.on("message", messagem => {
    const messagemSplit = messagem.text.split(",");
    console.log(messagemSplit);
    if (messagemSplit.length == 5) {
      const dataSplit = messagem.text.split(",");
      const req = {
        params: {
          technology: dataSplit[0],
          location: dataSplit[1]
        }
      };
      const result = githubController.getDataGitHub(req);
      console.log(result);
      const bot = createNewBot(dataTelegram.token);
      const dataJSON = JSON.stringify(result);
      bot.sendMessage(dataTelegram.liveloGroup, dataJSON);
    }
  });
}

init();
