#!/usr/bin/env node // for *nix systems, ignored in windows

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
        return urls[0]; // return first URL found
    } else {
        return 0;
    }
}

async function extractImages(link) {
    console.log(`Attempting to find images from ${link}...`)
    
    // new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // go to specified url
    await page.goto(link, { waitUntil: 'networkidle2' }); 
    // wait for the network to be idle to ensure complete content load

    // extract images from page
    const images = await page.evaluate(() => {
        const images = document.querySelectorAll('img[alt="Image"][draggable="true"].css-9pa8cd');
        // return srcs as an array
        return Array.from(images).map(img => img.src);
        // no log here bcs logging to browser console not needed
    });

    // check how many images were found
    if (images.length === 0) {
        console.log('No images found.');
    } else {
        console.log("Images found:", images.length);
        console.log("Image sources:", images); // links instead of template literals
    }

    // close browser
    await browser.close();
    console.log(`Closing browser...`);

    return images;
}


client.on('messageCreate', async(message) => {
    // if (message.content.startsWith('sometext')) {}
    if (message.author.bot) return; // ignore messages sent by bots

    // check if the bot is mentioned in the message
    if (message.mentions.has(client.user)) {
        let twitterLink = "";
        // loose equality
        if ((twitterLink = extractLink(message)) == 0) {
            message.channel.send("No twitter link found.");
            return
        }
        // add twitter link without embed
        const newMessage = `^\n<${twitterLink}>`;

        const images = await extractImages(twitterLink);

        // create new attachments array from images
        const attachments = images.map(imagesrc => {
            // send og/large image instead of compressed
            const newsrc = imagesrc.split('?format=jpg')[0] + '?format=jpg&name=large';
            const attachment = new AttachmentBuilder(newsrc, {name: `${newsrc}.jpg`});
            console.log('Attachment:', attachment); // TEMP check
            return attachment; // explicit return needed
        });
        
        if (attachments.length > 0) {
            try {
                await message.channel.send({content: newMessage,  files: attachments});
                console.log(`Attachment/s sent in channel ${message.channel.name}`);
            } catch (error) {
                console.error("Error sending images", error);
            }
        } else {
            await message.channel.send('No images found.');
        }
    }
});


client.login(token);


// Twitter images examples
// <img alt="Image" draggable="true" src="https://pbs.twimg.com/media/GTgkRGqbAAALZF0?format=jpg&amp;name=900x900" class="css-9pa8cd">
// <img alt="Image" draggable="true" src="https://pbs.twimg.com/media/GVBf3zcasAAa9OL?format=jpg&amp;name=medium" class="css-9pa8cd">
// <img alt="Image" draggable="true" src="https://pbs.twimg.com/media/GWrkp13bcAA-DrP?format=jpg&amp;name=900x900" class="css-9pa8cd">

