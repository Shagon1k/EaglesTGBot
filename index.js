const TelegramBot = require("node-telegram-bot-api");
const stringMath = require("string-math");

const CHECK_ANSWERS = [
  "да 👍",
  "нет 👎",
  "похуй 😐︎",
  "сериал.. 📺",
  "Топор подскажет! 🪓",
  "белое ⚪",
  "серое 🧙‍♂️",
  "чёрное ⚫",
];
const RANDOM_ANSWERS = ["Факт! 👆", "Гигигага 😂"];
const NU_CHTO_TAM_ANSWER = "Ну что там? 🧝";

const RANDOM_ANSWER_CHANCE = 0.04;
const GAY_ANSWER_CHANCE = 0.3;

const GAY_REGEXP = /гей/i;
const INESSA_REGEXP = /инесса/i;
const MATH_EXPRESSION_REGEXP = /([\d\(\)]+).+([\d\(\)]+)/;
const THREE_X_CUBE_REGEXP = /3\*?[xх]\^3\+C/i;

const token = process.env.BOT_TOKEN;

const handleInessaElf = (bot, chatId, msgId) => {
  bot.sendMessage(chatId, NU_CHTO_TAM_ANSWER, {
    reply_to_message_id: msgId,
  });
};

const handleInessaMath = (bot, chatId, msgId, msgText) => {
  const mathExpression = msgText?.match(MATH_EXPRESSION_REGEXP)?.[0];
  if (!mathExpression) {
    return;
  }
  const mathResult = stringMath(mathExpression);

  if (mathResult !== null) {
    bot.sendMessage(chatId, `${mathResult}, мой птенчик 😘`, {
      reply_to_message_id: msgId,
    });
  }
};

const handleGayRequest = (bot, chatId, msgId) => {
  const shouldGayAnswer = Math.random() <= GAY_ANSWER_CHANCE;

  if (shouldGayAnswer) {
    bot.sendMessage(chatId, "Естественно! 👆", {
      reply_to_message_id: msgId,
    });
  }
};

const handleRandomAnswer = (bot, chatId, msgId) => {
  const shouldDefaultAnswer = Math.random() <= RANDOM_ANSWER_CHANCE;
  if (shouldDefaultAnswer) {
    const answer =
      RANDOM_ANSWERS[Math.floor(Math.random() * RANDOM_ANSWERS.length)];

    bot.sendMessage(chatId, answer, {
      reply_to_message_id: msgId,
    });
  }
};

const runBot = () => {
  const eaglesBot = new TelegramBot(token, { polling: true });

  // Log TG Bot errors if any
  eaglesBot.on("polling_error", (msg) => console.log(msg));

  eaglesBot.onText(/\/check/, (msg) => {
    const chatId = msg.chat.id;

    const answer =
      CHECK_ANSWERS[Math.floor(Math.random() * CHECK_ANSWERS.length)];

    eaglesBot.sendMessage(chatId, `Я считаю, ${answer}`);
  });

  eaglesBot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const { message_id: msgId, text: msgText } = msg;

    if (typeof msgText !== "string") {
      return;
    }

    switch (true) {
      case THREE_X_CUBE_REGEXP.test(msgText):
        handleInessaElf(eaglesBot, chatId, msgId);
        break;
      case INESSA_REGEXP.test(msgText):
        handleInessaMath(eaglesBot, chatId, msgId, msgText);
        break;
      case GAY_REGEXP.test(msgText):
        handleGayRequest(eaglesBot, chatId, msgId);
        break;
      case true:
        handleRandomAnswer(eaglesBot, chatId, msgId);
        break;
      default:
        return;
    }
  });
};

runBot();
