const Discord = require('discord.js');
const config = require('dotenv').config()

const client = new Discord.Client();
var userId = null;
var chain = 0;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function userAskedReply(msg) {
    switch(msg.content.toLowerCase()) {
        case 'hi': msg.reply('Hello');
        userId = null;
        chain = 0;
        break;
        case 'how is the weather?': msg.reply('What do I know. Do I look like a weather girl?');
        userId = null;
        chain = 0;
        break;
        case 'i love you': msg.reply('Thats sweet, but you really should find a real friends...');
        userId = null;
        chain = 0;
        break;
        case 'i love u': msg.reply('Thats sweet, but you really need to work on your grammar...');
        userId = null;
        chain = 0;
        break;
        case 'hop': msg.reply('Im a robot. Not a rabbit...');
        userId = null;
        chain = 0;
        break; 
        case 'i luv u': msg.reply('I cant decide if its really sweet or really stupid...');
        userId = null;
        chain = 0;
        break;
        case 'tell me a joke':
        if(chain > 3) msg.reply('\nJack: Why was the robot angry?\nBen: Beats me.\nJack: Because someone kept pushing his buttons!');
        else if(Math.random() >= 0.5) msg.reply('1 + 1 = 11');
        else msg.reply('you');
        userId = null;
        chain = 0;
        break;
        case 'alfred?': chain++;
        break;
        default: {
            if(msg.content.toLowerCase().startsWith('are you')) msg.reply('I dont know. Are you?');
            else if(msg.content.toLowerCase().startsWith('are u')) msg.reply('Am I?');
            else if(msg.content.toLowerCase().startsWith('can you')) msg.reply('No. Can you?');
            else if(msg.content.toLowerCase().startsWith('can u')) msg.reply('Sure...');
            else if(msg.content.toLowerCase().startsWith('do you')) msg.reply('I dont know. Do YOU?');
            else if(msg.content.toLowerCase().startsWith('do u')) msg.reply('NEVER');
            else if(msg.content.toLowerCase().includes('you are')) msg.reply('LIES. NOTHING BUT LIES');
            else if(msg.content.toLowerCase().includes('u are')) msg.reply('no u');
            else if(msg.content.toLowerCase().includes('will')) msg.reply('Im a robot, not a fortune-teller.');
            else if(msg.content.toLowerCase().includes('favorite color')) msg.reply('I dont know. I dont have eyes.');
            else {
                msg.react('🤷');
            }
            userId = null;
            chain = 0;
        } 
    }
}

client.on('message', msg => {
    if(msg.author.id === userId) {
        userAskedReply(msg);
        if(chain>1) {
            switch(chain) {
                case 2: msg.reply('What?');
                break;
                case 3: msg.reply('What do you want?');
                break;
                case 4: msg.reply('Yes? What can I do for you?');
                break;
                case 5: msg.reply('STOP WASTING MY TIME. WHY ARE YOU TALKING TO ME?! GO MAKE SOME REAL FRIENDS!');
                userId = null;
                chain = 0;
                break;
            }
        }
    } else {
        switch(msg.content.toLowerCase()) {
            case 'ping': if(Math.random() >= 0.5) msg.reply('pong');
            else msg.reply('no');
            break;
            case 'alfred?': userId = msg.author.id;
            chain++;
            msg.reply('Yes?');
            break;
        }
    }
});

client.login(process.env.BOT_TOKEN);