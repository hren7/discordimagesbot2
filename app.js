
const token = require("./token.js"); // import

const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
// the following intents are copied from online
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,            // Required to interact with guilds (servers)
        GatewayIntentBits.GuildMessages,     // Required to listen to messages in guilds
        GatewayIntentBits.MessageContent     // Required to read message content
    ]
});

const puppeteer = require('puppeteer');


client.on('ready', function() {
    console.log('Bot now running!');
   });

// Handle process termination
process.on('SIGINT', () => {
    console.log('Bot is stopping...');
    process.exit();
});

process.on('exit', (code) => {
    console.log(`Bot stopped with exit code ${code}`);
});


function extractLink(message) {
    // check that there's a twitter link
    // extract link and return it
    const urlRegex = /(https?:\/\/?((fx|vx)?twitter\.com|x\.com)[^\s>]+)/g; // excludes ending >
    const urls = message.content.match(urlRegex); // check if it matches

    if (urls) {
        console.log('URLs found:', urls); // urls is an array of all urls
        return urls; // return all urls
    } else {
        return []; // empty array
    }
}

async function extractImages(link) {
    console.log(`Attempting to find images from ${link}...`)
    
    // new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // go to specified url
    await page.goto(link, { waitUntil: 'networkidle2' }); 
    // wait for the network to be idle 2 to ensure complete content load

    // extract images from page
    const images = await page.evaluate(() => {
        const images = document.querySelectorAll('img[alt="Image"][draggable="true"].css-9pa8cd');
        // return srcs as an array
        return Array.from(images).map(img => img.src);
        // no log here bcs logging to browser console not needed
    });

    // close browser
    await browser.close();
    console.log(`Closing browser...`);

    // check how many images were found
    if (images.length === 0) {
        console.log('No images found.');
    } else {
        console.log("Images found:", images.length);
        console.log("Image sources:", images); // links instead of template literals
    }

    return images;
}


client.on('messageCreate', async(message) => {
    // if (message.content.startsWith('sometext')) {}
    if (message.author.bot) return; // ignore messages sent by bots

    else if (message.content.trim() === `<@${client.user.id}>`) {
        message.channel.send("This hasn't been implemented yet!");
    }

    // check if the bot is mentioned in the message
    else if (message.mentions.has(client.user)) {
        let twitterLinks = [];
        // loose equality
        if ((twitterLinks = extractLink(message)).length == 0) {
            message.channel.send("*No twitter link found.*");
            return
        }

        let images = [];
        for (const link of twitterLinks) {
            const newImages = await extractImages(link);
            if (newImages.length > 0) {
                // ... is the spread operator to spread the elements of an array
                images.push(...newImages);
            } else {
                twitterLinks = twitterLinks.filter(item => item != link);
            }
        }

        // add twitter link without embed
        const messageLinks = twitterLinks.map(link => `<${link}>`).join('\n');
        const newMessage = `^\n${messageLinks}`;

        // create new attachments array from images
        const attachments = images.map(imagesrc => {
            // send og/large image instead of compressed
            const splitsrc = imagesrc.split('?format=');
            const srctype = splitsrc[1].split('&')[0]; // find file type
            const newsrc = splitsrc[0] + `?format=${srctype}&name=large`;
            const attachment = new AttachmentBuilder(newsrc, {name: `${newsrc}.jpg`});
            //console.log('Attachment:', attachment); // TEMP check
            return attachment; // explicit return needed
        });
        
        if (attachments.length > 0) {
            try {
                await message.channel.send({content: newMessage,  files: attachments});
                console.log(`Attachment/s sent in channel ${message.channel.name}!`);
            } catch (error) {
                console.error("Error sending images", error);
            }
        } else {
            await message.channel.send('No images found.');
        }
    }
});


client.login(token);

