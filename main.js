const TeleBot = require('telebot')
const routes = require('./routes/routes')

const BUTTONS = {
    hello: {
        label: '👋 Hello',
        command: '/find'
    }
};

const bot = new TeleBot({
    token : '429346965:AAGTcvwTMzJ2Lr6LYa6O7Y4X6QP-i4zi--U',
    polling : {
        interval: 1000, // How often check updates (in ms).
        timeout: 0, // Update polling timeout (0 - short polling).
        limit: 100, // Limits the number of updates to be retrieved.
        retryTimeout: 5000 // ms
    },
    usePlugins: ['namedButtons'],
    pluginConfig: {
        namedButtons: {
            buttons: BUTTONS
        }
    }
})

// bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome! What do you have in fridge today?'))
function print(msg) {
    if (msg.messages) {
        msg.messages.forEach(message => {
            bot.sendMessage(msg.chat.id, message['text'], {parseMode : 'Markdown'})
        }, this) 
    }
}

bot.on('text', msg => routes.searchQuery(msg, print))
// bot.mod('text', msg => routes.searchQuery(msg, print))

// Button callback

// bot.on('/find', msg => routes.searchQuery(msg, print))
// bot.mod('callbackQuery', routes.searchQuery);

bot.start()