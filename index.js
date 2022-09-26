const TelegramBot = require('node-telegram-bot-api');

const CHECK_ANSWERS = ['да 👍', 'нет 👎', 'похуй 😐︎', 'сериал.. 📺', 'Топор подскажет! 🪓', 'белое ⚪', 'серое 🧙‍♂️', 'чёрное ⚫'];
const RANDOM_ANSWERS = ['Факт! 👆'];
const RANDOM_ANSWER_CHANCE = 0.02;

const token = process.env.BOT_TOKEN;

const eaglesBot = new TelegramBot(token, {polling: true});

eaglesBot.onText(/\/check/, (msg, match) => {
    const chatId = msg.chat.id;

    const answer = CHECK_ANSWERS[Math.floor(Math.random()*CHECK_ANSWERS.length)];

    eaglesBot.sendMessage(chatId, `Я считаю, ${answer}`);
});

eaglesBot.on('message', (msg) => {
    const shouldAnswer = Math.random() <= RANDOM_ANSWER_CHANCE;
    if (!shouldAnswer) {
        return;
    }

    const chatId = msg.chat.id;
    const answer = RANDOM_ANSWERS[Math.floor(Math.random()*RANDOM_ANSWERS.length)];

    eaglesBot.sendMessage(chatId, answer);
});
