# Discord Images Bot
Twitter Images Bot for Discord

## discordimagesbot
Attempt at creating a discord bot to extract images from Twitter.

When mentioned, the bot takes the first twitter link sent by the user and extracts all images from it, sending it into the channel.

## Development
### Version 1
The bot has basic functionality.

Features:
- respond to mentions only
- check a twitter/x link is posted (if vx or fx also ok) 
  - take only the first twitter link if there's more than one
- access the twitter link and find all images in the tweet
- extract and send all images in discord, along with the original message (excluding the mention of the bot)
  - e.g. original message was: x.com/someuser/status/1234567 some_message_here @Twitter Images
  - the ping may be anywhere
  - the response should be: x.com/someuser/status/1234567 some_message_here [image attachments]
- respond appropriately if no images found
- can:
  - extract and send 1 image
  - extract and send all/multiple images

Features left to work on:
- handle no images
  - pure text tweets are handled correctly right now
  - but the bot treats quote retweets as an image that is part of the tweet and sends that

### Version 2
Discord.js updated to ver 14.16.3. Code updated to work with new version e.g. added intents.

Features:
- the bot can now respond to messages in threads

#### Version 2.1
- The image previously extracted was not of the size of the original post. Fixed.
- Add <> around the twitter link the images were taken from to remove the discord embed for that link only
- Message replaced with '^' and twitter link used instead of original message

Features left to work on:
- handle no images; ignore images that are part of quote retweets
- respond to messages containing only the bot mention, where the user is replying to a message containing a suitable witter link, and extract images from there, replying to the message that contained the link

## Notes
Run using node app.js in directory or twitter-images (runs anywhere after using npm link).

Uses puppeteer to access and extract images from twitter.

*node modules folder and token file ignored