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
const RANDOM_ANSWER_CHANCE = 0.04;
const GAY_ANSWER_CHANCE = 0.3;

const GAY_REGEXP = /гей/i;
const INESSA_REGEXP = /инесса/i;
const MATH_EXPRESSION_REGEXP = /([\d\(\)]+).+([\d\(\)]+)/;

const token = process.env.BOT_TOKEN;

const handleInessaMath = (bot, chatId, msgId, msgText) => {
  const mathExpression = msgText.match(MATH_EXPRESSION_REGEXP)[0];
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
    const { id: msgId, text: msgText } = msg;

    switch (typeof msgText === 'string') {
      case INESSA_REGEXP.test(msgText):
        handleInessaMath(eaglesBot, chatId, msgId, msgText);
        break;
      case GAY_REGEXP.test(msgText):
        handleGayRequest(eaglesBot, chatId, msgId);
        break;
      default:
        return;
    }

    const shouldDefaultAnswer = Math.random() <= RANDOM_ANSWER_CHANCE;

    if (shouldDefaultAnswer) {
      const answer =
        RANDOM_ANSWERS[Math.floor(Math.random() * RANDOM_ANSWERS.length)];

      eaglesBot.sendMessage(chatId, answer);
    }
  });
};

runBot();
