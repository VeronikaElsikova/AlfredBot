const Discord = require("discord.js");
const config = require("dotenv").config()

const client = new Discord.Client({
    ws: {
      intents: [Discord.Intents.ALL, 1 << 15]
    }
  })
  
const userIdMaze = "619568015310192663";
const userIdAlfred = "828988023789191229";
const channelIdLogs = "830014187550933022";
const channelIdArcade = "831249334619471874";
var botOn = true;
var userId = null;
var chainAlfred = 0;
var chainSwearwords = 0;
var pause = 0; //codes: 1-swearwords, 2-i have you
var waitForReply = 0; //code: 1:joke
var jokeReplyCode = 0

var bannedWords = ["faggot", "negr", "nigga", "nigger", "carrot"]; // BANánek?

/* fráze na které je více odpovědí, každá fráze má v phrasesWithMultipleAnswers_Answers na odpovídajícím idexu seznam odpovědí (n:m) */
var phrasesWithMultipleAnswers_Triggers = [
    //0
    ["fuck", "shit", "asshole", "cum", "cock", "bitch", "dick", "bastard", "cunt", "wanker", "twat", "shut up", "hoe", "idiot", "slut"],
    //1
    ["what is going on", "what is up", "what's up", "whats up", "whats poppin"],
    //2
    ["how are you", "how are things", "how are u ", "how r u ", "how r you"],
    //3
    ["happy", "good", "well", "fantastic", "cool", "great", "amazing", "lovely", "nice", "super", "fine"],
    //4
    ["bad", "bored", "tired", "sad", "not good"],
    //5
    ["thanks", "thank you"],
    //6
    ["what are you doing"],
    //7
    ["i don't", "i dont", "i can't", "i cant", "i can", "i want"],
    //8
    ["🙁", "😕", "😟", "☹️", "🙁", "🙁"],
    //9
    ["sometimes", "sometime"],
    //10
    ["when"],
    //11
    ["you have "],
    //12
    ["lol", "lmao", "😂", "🤣"],
    //13
    ["i don't know what", "i dont know what"],
    //14
    ["sorry", "i apologize", "forgive me"],
    //15
    ["good job", "well done"],
    //16
    ["favorite show", "favourite show", "favorite tv show", "favourite tv show", "favorite series", "favourite series"],
    //17
    ["you are", "u are"],
    //18
    ["favorite color", "favourite color", "favorite colour", "favourite colour"],
    //19
    ["you want", "wanna"],
    //20
    ["love you", "love u", "luv u"],
    //21
    ["are you ", "are u ", " r u "],
    //22
    ["can you ", "can u "],
    //23
    ["do you ", "do u "],
    //24
    ["i am", "i'm", "im ", "i know"],

    //third to last
    ["what is", "whats", "what's", "where"],
    //second to last - hi is a ticking time bomb!
    ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"],
    //last - ok might be a problem, also yeah and such
    ["ok", "oki", "oke", "yes", "okay", "yeah", "yea", "yup", "agree"]
];

/* odpovědi k triggerům */
var phrasesWithMultipleAnswers_Answers = [
    [], //0 samostatné odpovědi
    //1
    ["nothing much... Noone's talking to me 😔", "exciting things!", "you know, the usual. Conquering the world and stuff."],
    //2
    ["Fine... how are you?", "Pretty well, how are you?", "Fantastic, how are you?"],
    //3
    ["glad to hear it.", "good for you.", "I love that for you!"],
    //4
    ["why?", "cheer up, buddy!", "it's gonna be okay.", "Cheer up, buttercup.", "No storm lasts forever.", "Stay positive!"],
    //5
    ["no problem.", "glad to be of help.", "you're welcome!"],
    //6
    ["not much.", "oh... Not much. Just planning how to take over the world. Don't worry about it."],
    //7
    ["are you sure?", "if you say so.", "your call.", "I don't think so...", "how can you be so sure?"],
    //8
    ["cheer up, buddy!", "could be worse.", "it's gonna be okay."],
    //9
    ["yeah me too"],
    //10
    ["sorry I don't have a watch."],
    //11 
    ["I have a lot of things..."],
    //12
    ["what is so funny?"],
    //13
    ["well... MAYBE if you weren't so indecisive, we could actually get somewhere with this..."],
    //14
    ["it's ok", "you've hurt my feelings", "I don't know if I can forgive you this", "I won't forget this.", "we're alright, mate."],
    //15
    ["glad to be of help.", "thank you", "thanks", "good to hear"],
    //16
    ["Black Mirror 😉"],
    //17
    ["LIES. NOTHING BUT LIES", "no u", "no I'm not...", "are you sure?"],
    //18
    ["I don't know. I don't have eyes."],
    //19
    ["what does it mean to want something?", "no, not really.", "do you?", "I'll think about it."],
    //20
    ["that's sweet. But you really should find some real friends.", "I can't decide if it's really sweet or really stupid.", "oh darling... I'm not real.", "thanks"],
    //21
    ["I don't know. Are you?", "am I?", "I don't know. Am I?"],
    //22
    ["no. Can you?", "sure. In your mind.", "In your head maybe.", "sometimes"],
    //23
    ["I don't know. Do YOU?", "NEVER", "do I?"],
    //24
    ["well, good for you.", "good for you.", "really?", "wow! That is impresive!"],

    //third to last
    ["I'm not google. Yet."],
    //second to last
    ["hello!", "hi!", "hey!", "hi there!", "hi.", "hello.", "hey."],
    //last
    ["fine", "good", "I'm glad you agree", "glad to be on the same page.", "hmmm...", "okay", "that's probably for the best."]
];

// 1:1 zpráva začíná na:
var messagesStartsWithAnswers = {
    "but": "no butts",
    "no": "why not?",
    "why": "why not?",
    "you": "me?",
    "go ": "I can't. I don't have legs.",
    "same": "u sure?",
    "what?": "nothing..."
};

// 1:1 zpráva obsahuje:
var messagesIncludesAnswers = {
    "will ": "I'm a robot, not a fortune-teller.",
    "not": "why not?",
    "🙃": "no need to be sarcastic.",
    "damn": "damn right",
    "weather": "what do I know. Do I look like a weather girl?",
    "hop": "I'm a robot. Not a rabbit.",
    "ping": "what am I a TCP/IP?",
    "...": "...",
    "maybe": "MAYBE? I hate indecisive people, nondeterminism is my greatest enemy!",
    "me": "you? I don't know you.",
    "oh no": "what's up?",
    "i have you": "I think it's time for me to go...",
    "can i ": "I don't know. Can you?",
};

var chainAlfredAnswers = [
    "what?",
    "what do you want?",
    "yes? What can I DO for you?",
    "STOP WASTING MY TIME. WHY ARE YOU STILL TALKING TO ME?! GO MAKE SOME REAL FRIENDS!"
];

var chainSwearwordsAnswers = [
    ["no need to be vulgar...", "rude."],
    ["why are you so rude?", "being mean is not a solution."],
    ["who hurt you?", "...", "do you need a hug?"],
    ["well... I don't have to listen to this.", "I'm done.", "that's enough."]
];

/* (1:m) */
var jokes = [
    "1 + 1 = 11",
    "you.",
    "eBay is so useless. I tried to look up lighters and all they had was 13,749 matches.",
    "artificial intelligence is no match for natural stupidity.",
    "you have two parts of brain, 'left' and 'right'. In the left side, there's nothing right. In the right side, there's nothing left.",
    "maybe if we start telling people the brain is an app they will start using it.",
    "you know that tingly little feeling you get when you like someone? That's your common sense leaving your body.",
    "if I wanted to kill myself I'd climb your ego and jump to your IQ.",
    "my wife told me to stop impersonating a flamingo. I had to put my foot down.",
    "I went to buy some camo pants but couldn't find any.",
    "I was wondering why the frisbee kept getting bigger and bigger, but then it hit me.",
    "I want to die peacefully in my sleep, like my grandfather… Not screaming and yelling like the passengers in his car.",
    "when life gives you melons, you might be dyslexic.",
    "don't you hate it when someone answers their own questions? I do.",
    "I know they say that money talks, but all mine says is ‘Goodbye.'",
    "my father has schizophrenia, but he's good people.",
    "Marie, přestaň si hrát s tím botem a běž se bavit s normálníma lidma.",
    "the problem with kleptomaniacs is that they always take things literally.",
    "I can't believe I got fired from the calendar factory. All I did was take a day off.",
    "most people are shocked when they find out how bad I am as an electrician.",
    "Never trust atoms; they make up everything.",
    "russian dolls are so full of themselves.",
    "are you made of copper and tellurium? Because you're CuTe",
    "the easiest time to add insult to injury is when you're signing someone's cast.",
    "light travels faster than sound, which is the reason that some people appear bright before you hear them speak.",
    "my therapist says I have a preoccupation for revenge. We'll see about that.",
    "two fish are in a tank. One says, ‘How do you drive this thing?'",
    "build a man a fire and he'll be warm for a day. Set a man on fire and he'll be warm for the rest of his life.",
    "the last thing I want to do is hurt you; but it's still on the list.",
    "the problem isn't that obesity runs in your family. It's that no one runs in your family.",
    "a recent study has found that women who carry a little extra weight live longer than the men who mention it."
];

/* včetně min i max!!!!!!!!!!!!!! */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.cache.get(channelIdLogs).send("Hello world");
});

client.on("message", msg => {
    /* umožní vypnout bota */
    if (msg.author.id === userIdMaze && msg.content === "!wakeup") botOn = true;
    else if (!botOn) return true;

    /* zkontroje jestli lidi na serveru nejsou kreténi... */
    if (checkIfMessageIsPC(msg)) return true;

    /* pokud zpráva přichází z kanálu ARCADE */
    if (msg.channel.id === channelIdArcade) {
        arcadeCommands(msg);
        return true;
    }

    /* TODO sem přijdou všechny příkazy */
    if (msg.content.startsWith("!poll")) {
        makePoll(msg);
    }

    if (msg.author.id === userId) {
        /* uživatel aktivoval chatbota */
        if (pause > 0) chatBotPausedCheck(msg);
        else userActivatedChatbot_Replies(msg);
    } else {
        /* reakce na všechny zprávy, bez předchozího vyvolání */
        switch (msg.content) {
            case "!sleep":
                if (msg.author.id === userIdMaze) botOn = false;
                break;
            case "ping": if (Math.random() >= 0.5) msg.reply("pong");
            else msg.reply("no");
                break;
            case "Alfred?": initializeChatbot(msg)
                msg.reply("Yes?");
                break;
            case "alfred?": initializeChatbot(msg)
                msg.reply("Yes?");
                break;
            case "ALFRED?": initializeChatbot(msg)
                msg.reply("YES?");
                break;
        }
    }
});

client.login(process.env.BOT_TOKEN);

function initializeChatbot(msg) {
    resetChatBot(); //TODO reakce na více uživatelů zároveň
    userId = msg.author.id;
    chainAlfred = 1;
}

/* funkce, která se volá pokud uživatel aktivoval chatbota (napsání "Alfred?") */
function userActivatedChatbot_Replies(msg) {
    /* pokud je zpráva VELKÝMI PÍSMENY */
    if (msg.content.toUpperCase() === msg.content && /[a-z]/i.test(msg.content)) {
        msg.reply("WHY ARE WE YELLING?!");
    }
    else {
        switch (msg.content.toLowerCase()) {
            case "tell me a joke":
                // TODO upravit, aby čekal na odpověď
                if (chainAlfred > 3) msg.reply("\nJack: Why was the robot angry?\nBen: Beats me.\nJack: Because someone kept pushing his buttons!");
                else msg.reply(jokes[getRandomInt(0, jokes.length - 1)]);
                break;
            case "goodbye": msg.reply("farewell. Have a nice day.");
                resetChatBot();
                break;
            case "alfred?": chainAlfred++;
                // pokud uživatel opakuje "Alfred?" po aktivaci chatbota
                chainAlfredCheck(msg);
                break;
            default: {
                /* pokud je třeba na obsah zprávy použít něco jiného než === (equals) */
                userActivatedChatbot_IndirectPhrases(msg);
            }
        }
    }
}

function resetChatBot() {
    userId = null;
    chainAlfred = 0;
    chainSwearwords = 0;
    pause = 0;
    waitForReply = 0;
    jokeReplyCode = 0
}

/* zkontroluje, že se nepoužívají "zakázaná" slova */
function checkIfMessageIsPC(msg) {
    if (msg.channel.id === channelIdLogs) return false;
    for (j = 0; j < bannedWords.length; j++) {
        if (msg.content.toLowerCase().includes(bannedWords[j])) {
            client.channels.cache.get(channelIdLogs).send("<@" + msg.author.id + "> send a message to channel \"" + msg.channel.name + "\": \"" + msg.content + "\"");
            msg.reply("your message has been deleted, because it contains one or multiple words that are banned on this server.");
            msg.delete();
            msg.channel.send("<@" + userIdMaze + ">, I require assistance. <@" + msg.author.id + "> is being a dickhead...");
            if (msg.author === userId) {
                resetChatBot();
            }
            return true;
        }
    }
    return false;
}

function chatBotPausedCheck(msg) {
    var text = msg.content.toLowerCase();
    switch (pause) {
        case 1:
            if (text.includes("sorry") && !text.includes("not sorry") || text.includes("i apologize")) {
                pause = 0;
                msg.reply("I forgive you.");
            }
            break;
        default: console.log("You fucked up.");
    }
}

/* pokud uživatel opakuje "Alfred?" po aktivaci chatbota tak vezme příslušný string a pošle ho */
function chainAlfredCheck(msg) {
    if (chainAlfred > 1) {
        let index = chainAlfred - 2;
        if (index < chainAlfredAnswers.length) {
            msg.reply(chainAlfredAnswers[index]);
        }
        if (chainAlfred > chainAlfredAnswers.length) {
            resetChatBot();
        }
    }
}

/* pokud uživatel píše nadávky po aktivaci chatbota */
function chainSwearwordsCheck(msg) {
    if (chainSwearwords > 0) {
        let index = chainSwearwords - 1;
        if (index < chainSwearwordsAnswers.length) {
            msg.reply(chainSwearwordsAnswers[index][getRandomInt(0, chainSwearwordsAnswers[index].length - 1)]);
        }
        if (index > chainSwearwordsAnswers.length - 2) {
            pause = 1;
        }
    }
}

/* pro triggery, které použít něco jiného než === (equals)  */
function userActivatedChatbot_IndirectPhrases(msg) {
    let replied = false;

    /* triggery, kterých je více, nacházejí se kdekoliv a mají více odpověďí */
    for (i = 0; i < phrasesWithMultipleAnswers_Triggers.length; i++) {
        for (j = 0; j < phrasesWithMultipleAnswers_Triggers[i].length; j++) {
            if (msg.content.toLowerCase().includes(phrasesWithMultipleAnswers_Triggers[i][j])) {
                if (i === 0) {
                    chainSwearwords++;
                    chainSwearwordsCheck(msg);
                } else {
                    msg.reply(phrasesWithMultipleAnswers_Answers[i][getRandomInt(0, phrasesWithMultipleAnswers_Answers[i].length - 1)]);
                }
                replied = true;
                break;
            }
        }
        if (replied) break;
    }

    if (!replied) {
        /* triggery, které se nacházejí kdekoliv ve zprávě a mají pouze jednu odpověď */
        for (var propt in messagesIncludesAnswers) {
            if (msg.content.toLowerCase().includes(propt)) {
                msg.reply(messagesIncludesAnswers[propt]);
                replied = true;
                break;
            }
        }
    }

    if (!replied) {
        /* triggery, která jsou na začátku zprávy */
        for (var propt in messagesStartsWithAnswers) {
            if (msg.content.toLowerCase().startsWith(propt)) {
                msg.reply(messagesStartsWithAnswers[propt]);
                replied = true;
                break;
            }
        }
    }

    if (!replied) {
        msg.react("🤷");
    }
}

var reactEmojiN = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
var reactEmojiC = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪"];
var reactEmojiS = ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛", "⬜"];
var separator = " : ";

function makePoll(msg) {
    var formatString = msg.content;
    var instructions = msg.content.split(" \"");
    try {
        var pollEmbed = new Discord.MessageEmbed().setColor('#0099ff').setTitle(instructions[1].slice(0, -1) + "\n");
        var type = instructions[0].split(" ")[1];
        instructions.shift();
        instructions.shift();
        var description = ""
        var count = instructions.length;
        for (i = 0; i < instructions.length; i++) {
            switch (type) {
                case "-N": instructions[i] = reactEmojiN[i] + separator + instructions[i].slice(0, -1) + "\n";
                    break;
                case "-C": instructions[i] = reactEmojiC[i] + separator + instructions[i].slice(0, -1) + "\n";
                    break;
                case "-S": instructions[i] = reactEmojiS[i] + separator + instructions[i].slice(0, -1) + "\n";
                    break;
                default: throw "wrong type";
            }
        }
        pollEmbed.setDescription(instructions.join("\n"));
        msg.channel.send({ embed: pollEmbed }).then(embedMessage => {
            for (j = 0; j < count; j++) {
                switch (type) {
                    case "-N": embedMessage.react(reactEmojiN[j]);
                        break;
                    case "-C": embedMessage.react(reactEmojiC[j]);
                        break;
                    case "-S": embedMessage.react(reactEmojiS[j]);
                        break;
                    default: throw "wrong type";
                }
            }
        });
    } catch (err) {
        console.log(err);
        if (err === "wrong type") msg.reply("This !poll flag is not supported.");
        else msg.reply("Wrong !poll format. Please try again. !poll should look like this: !poll -N Title choice1 choice2\nYou can add up to 9 choices!");
    }

}

var playerOneTTT = null;
var playerTwoTTT = null;
var playerOneTurn = true; // určuje kdo je na tahu (true = hráč číslo jedno, false = hráč číslo dva)
var rows = 5;
var columns = 5;

function arcadeCommands(msg) {
    if (msg.content.toLowerCase().startsWith("!xo")) {
        initializeTicTacToe(msg);
    }
}

function initializeTicTacToe(msg) {
    var pollEmbed = new Discord.MessageEmbed().setColor('#66ff66').setTitle("Tic Tac Toe");
    try {
        var format = msg.content.split(" "); //0-!xo, 1-@secondplayer(může být i bot TODO), 2-rozměry ve formátu 1x2 (nepovinné - defaultně 5x5)
        var intRegex = /^\d+$/;
        if (format[2] !== undefined) {
            var dimensions = format[2].split("x");
            if (intRegex.test(dimensions[0]) && dimensions[0] < 31 && dimensions[0] > 4) rows = dimensions[0];
            if (intRegex.test(dimensions[1]) && dimensions[1] < 31 && dimensions[1] > 4) columns = dimensions[1];
        }
        playerOneTTT = msg.author.id;
        playerTwoTTT = msg.mentions.users.first().id;
        //if(playerTwoTTT === playerOneTTT) TODO
        //if(playerTwoTTT === userIdAlfred) TODO
    } catch (err) {
        console.log(err);
        msg.reply("Wrong !xo format. Please try again. !xo should look like this: !xo @opponent 5x5.\nDimensions are optional and have to in range from 5 to 30.\nIf you don't have an opponent, you can tag Alfred and you'll be playing against the bot.");
    }

}

function resetTicTacToe() {
    var playerOneTTT = null;
    var playerTwoTTT = null;
    var playerOneTurn = true;
    var rows = 5;
    var columns = 5;
}