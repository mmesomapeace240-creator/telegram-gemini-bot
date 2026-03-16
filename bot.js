require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    try {
        const result = await model.generateContent(userMessage);
        let reply = result.response.text();

        // prevent Telegram message limit error
        if (reply.length > 4000) {
            reply = reply.substring(0, 4000);
        }

        bot.sendMessage(chatId, reply);

    } catch (error) {
        console.log(error);
        bot.sendMessage(chatId, "Something went wrong.");
    }
});