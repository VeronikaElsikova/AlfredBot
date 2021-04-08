const Discord = require("discord.js");
const config = require("dotenv").config()

const client = new Discord.Client();
const userIdMaze = "619568015310192663";
var userId = null;
var chain = 0;

var bannedWords = ["faggot", "negr", "nigga", "nigger", "carrot"]; // BANánek?

/* fráze na které je více odpovědí, každá fráze má v phrasesWithMultipleAnswers_Answers na odpovídajícím idexu seznam odpovědí (n:m) */
var phrasesWithMultipleAnswers_Triggers = [
    //0
    ["fuck", "shit", "asshole", "cum", "cock", "bitch", "dick", "bastard", "cunt", "wanker", "twat", "shut up", "hoe"],
    //1
    ["what is going on", "what is up", "what's up", "whats up", "whats poppin"],
    //2
    ["how are you", "how are things"],
    //3
    ["happy", "good", "well", "fantastic", "cool", "great", "better", "amazing", "lovely", "nice", "super"],
    //4
    ["bad", "bored", "tired", "sad", "not good"],
    //5
    ["thanks", "thank you", "good job"],
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
    ["what is", "where"],
    //12
    ["lol", "lmao", "ha", "😂", "🤣"],
    //13
    ["i don't know what", "i dont know what"],
    //14
    ["sorry", "i apologize", "forgive me"],
    //second to last (ok might be a problem)
    ["ok", "oki", "oke", "yes", "okay", "yeah", "yea", "yup", "agree"],
    //last - hi is a ticking time bomb!
    ["hi", "hello", "hey"]
];

/* odpovědi k triggerům */
var phrasesWithMultipleAnswers_Answers = [
    //0
    ["no need to be vulgar...", "rude."],
    //1
    ["nothing much... Noone's talking to me 😔", "exciting things!", "you know, the usual. Conquering the world and stuff."], 
    //2
    ["Fine... how are you?", "Pretty well, how are you?", "Fantastic, how are you?"],
    //3
    ["glad to hear it.", "good for you.", "I love that for you!", "that's probably for the best."],
    //4
    ["why?", "cheer up, buddy!", "it's gonna be okay."],
    //5
    ["no problem.", "glad to be of help.", "you're welcome!"],
    //6
    ["not much.", "oh... Not much. Just planning how to take over the world. Don't worry about it."],
    //7
    ["are you sure?", "if you say so.", "your call.", "I don't think so...", "how can you be so sure?"],
    //8
    ["cheer up, buddy!", "could be worse.", "it's gonna be okay."],
    //9
    ["time is a construct..."],
    //10
    ["sorry I don't have a watch."],
    //11
    ["I'm not google... yet..."],
    //12
    ["what is so funny?"],
    //13
    ["well... MAYBE if you weren't so indecisive, we could actually get somewhere with this..."],
    //14
    ["it's ok", "you've hurt my feelings", "I don't know if I can forgive you this", "I won't forget this.", "we're alright, mate."],
    //second to last
    ["fine", "good", "I'm glad you agree", "glad to be on the same page."],
    //last
    ["hello!", "hi!", "hey!", "hi there!", "hi.", "hello.", "hey."]
];

var alfredChainAnswers = [
    "what?",
    "what do you want?",
    "yes? What can I DO for you?",
    "STOP WASTING MY TIME. WHY ARE YOU STILL TALKING TO ME?! GO MAKE SOME REAL FRIENDS!"
];

var messagesStartsWithAnswers = {
    "are you": "I don't know. Are you?",
    "are u": "am I?",
    "can you": "no. Can you?",
    "can u": "sure... In your mind.",
    "do you": "I don't know. Do YOU?",
    "do u": "NEVER",
    "i am": "good for you.",
    "i'm": "good for you.",
    "im": "good for you.",
    "but": "no butts",
    "no": "why not?",
    "why": "why not?",
    "you": "me?",
    "can i": "I don't know. Can you?",
    "go": "I can't. I don't have legs...",
    "same": "u sure?",
    "you have": "I have a lot of things..."
};

var messagesIncludesAnswers = {
    "you are": "LIES. NOTHING BUT LIES",
    "u are": "no u",
    "will": "I'm a robot, not a fortune-teller.", 
    "favorite color": "I don't know. I don't have eyes.",
    "favourite color": "I don't know. I don't have eyes.",
    "you want": "what does it mean to want something?",
    "wanna": "no, not really.",
    "not": "why not?",
    "🙃": "no need to be sarcastic.",
    "damn": "damn right",
    "weather": "what do I know. Do I look like a weather girl?",
    "love you": "that's sweet. But you really should find some real friends...",
    "love u": "that's sweet. But you really need to work on your grammar...",
    "luv u": "I can't decide if it's really sweet or really stupid...",
    "hop": "I'm a robot. Not a rabbit...",
    "ping": "what am I a TCP/IP?",
    "...": "...",
    "maybe": "MAYBE? I hate indecisive people, nondeterminism is my greatest enemy!",
    "me": "you? I don't know you.",
    "oh no": "what's up?",
    "i have you": "I think it's time for me to go..."
};

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
});

client.on("message", msg => {
    /* zkontroje jestli lidi na serveru nejsou kreténi... */
    if(checkIfMessageIsPC(msg)) return true;

    if(msg.author.id === userId) {
        /* uživatel aktivoval chatbota */
        userActivatedChatbot_Replies(msg);
    } else {
        /* reakce na všechny zprávy, bez předchozího vyvolání */
        switch(msg.content) {
            case "ping": if(Math.random() >= 0.5) msg.reply("pong");
            else msg.reply("no");
            break;
            case "Alfred?": userId = msg.author.id;
            chain++;
            msg.reply("Yes?");
            break;
            case "alfred?": userId = msg.author.id;
            chain = 1;
            msg.reply("Yes?");
            break;
            case "ALFRED?": userId = msg.author.id;
            chain++;
            msg.reply("YES?");
            break;
            default: {
            /* TODO sem přijdou všechny příkazy */
            if(msg.content.startsWith("!poll")) {
                makePoll(msg);
            }
            }
        }
    }
});

client.login(process.env.BOT_TOKEN);

/* funkce, která se volá pokud uživatel aktivoval chatbota (napsání "Alfred?") */
function userActivatedChatbot_Replies(msg) {
    /* pokud je zpráva VELKÝMI PÍSMENY */
    if(msg.content.toUpperCase() === msg.content && /[a-z]/i.test(msg.content)) {
        msg.reply("WHY ARE WE YELLING?!");
    }
    else { 
        switch(msg.content.toLowerCase()) {
            case "tell me a joke":
            // TODO upravit, aby čekal na odpověď
            if(chain > 3) msg.reply("\nJack: Why was the robot angry?\nBen: Beats me.\nJack: Because someone kept pushing his buttons!");
            else msg.reply(jokes[getRandomInt(0, jokes.length-1)]);
            break;
            case "goodbye": msg.reply("farewell. Have a nice day.");
            userId = null;
            chain = 0;
            break;
            case "alfred?": chain++;
            // pokud uživatel opakuje "Alfred?" po aktivaci chatbota
            alfredChain(chain, msg);
            break;
            default: {
                /* pokud je třeba na obsah zprávy použít něco jiného než === (equals) */
                userActivatedChatbot_IndirectPhrases(msg);
            } 
        }  
    }
}

/* zkontroluje, že se nepoužívají "zakázaná" slova */
function checkIfMessageIsPC(msg) {
    for(j = 0; j < bannedWords.length; j++) {
        if(msg.content.toLowerCase().includes(bannedWords[j])) {
            msg.channel.send("<@" + userIdMaze + "> I require assistance. <@" + msg.author.id + "> is being a dickhead...");
            if(msg.author===userId) {
                userId = null;
                chain = 0;
            }
            return true;
        }
    }
    return false;
}

/* pokud uživatel opakuje "Alfred?" po aktivaci chatbota tak vezme příslušný string a pošle ho */
function alfredChain(chain, msg) {
    if(chain>1) {
        let index = chain - 2;
        if(index < alfredChainAnswers.length) {
            msg.reply(alfredChainAnswers[index]);
        }
        if(chain > alfredChainAnswers.length) {
            userId = null;
            chain = 0;
        }
    }
}

/* pro triggery, které použít něco jiného než === (equals)  */
function userActivatedChatbot_IndirectPhrases(msg) {
    let replied = false;
    /* triggery, kterých je více, nacházejí se kdekoliv a mají více odpověďí */
    for(i = 0; i < phrasesWithMultipleAnswers_Triggers.length; i++) {
        for(j = 0; j < phrasesWithMultipleAnswers_Triggers[i].length; j++) {
            if(msg.content.toLowerCase().includes(phrasesWithMultipleAnswers_Triggers[i][j])) {
                msg.reply(phrasesWithMultipleAnswers_Answers[i][getRandomInt(0, phrasesWithMultipleAnswers_Answers[i].length-1)]);
                replied = true;
                break;
            }
        }
        if(replied) break;
    }
    
    if(!replied) {
        /* triggery, které se nacházejí kdekoliv ve zprávě a mají pouze jednu odpověď */
        for(var propt in messagesIncludesAnswers) {
            if(msg.content.toLowerCase().includes(propt)) {
                msg.reply(messagesIncludesAnswers[propt]);
                replied = true;
                break;
            }
        }
    }

    if(!replied) {
        /* triggery, která jsou na začátku zprávy */
        for(var propt in messagesStartsWithAnswers) {
            if(msg.content.toLowerCase().startsWith(propt)) {
                msg.reply(messagesStartsWithAnswers[propt]);
                replied = true;
                break;
            }
        }
    }
   
    if(!replied) {
        msg.react("🤷");
    }
}

var pollEmojiN = ["1️⃣ : ", "2️⃣ : ", "3️⃣ : ", "4️⃣ : ", "5️⃣ : ", "6️⃣ : ", "7️⃣ : ", "8️⃣ : ", "9️⃣ : "];
var pollEmojiC = ["🔴 : ", "🟠 : ", "🟡 : ", "🟢 : ", "🔵 : ", "🟣 : ", "🟤 : ", "⚫ : ", "⚪ : "];
var pollEmojiS = ["🟥 : ", "🟧 : ", "🟨 : ", "🟩 : ", "🟦 : ", "🟪 : ", "🟫 : ", "⬛ : ", "⬜ : "];

var reactEmojiN = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
var reactEmojiC = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪"];
var reactEmojiS = ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛", "⬜"];

function makePoll(msg) {
    var formatString = msg.content;
    var instructions = msg.content.split(" \"");
    try {
        var pollEmbed = new Discord.MessageEmbed().setColor('#0099ff').setTitle(instructions[1].slice(0,-1)+"\n");
        var type = instructions[0].split(" ")[1];
        instructions.shift();
        instructions.shift();
        var description = ""
        var count = instructions.length;
        for(i = 0; i < instructions.length; i++) {
            switch(type) {
                case "-N": instructions[i] = pollEmojiN[i].concat(instructions[i].slice(0,-1)).concat("\n");
                break;
                case "-C": instructions[i] = pollEmojiC[i].concat(instructions[i].slice(0,-1)).concat("\n");
                break;
                case "-S": instructions[i] = pollEmojiS[i].concat(instructions[i].slice(0,-1)).concat("\n");
                break;
                default: throw "wrong type";
            }
        }
        pollEmbed.setDescription(instructions.join("\n"));
        msg.channel.send({embed: pollEmbed}).then(embedMessage => {
            for(j = 0; j < count; j++) {
                switch(type) {
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
    } catch(err) {
        console.log(err);
        msg.reply("Wrong !poll format. Please try again. !poll should look like this: !poll -N Title choice1 choice2\nYou can add up to 9 choices!");
    }

}