# Discord Images Bot
## discordimagesbot2

Twitter Images Bot for Discord

Attempt at creating a discord bot to extract images from Twitter.

When mentioned, the bot takes the twitter link/s sent by the user and extracts all images from it, sending it into the channel.

## Usage
Run using node app.js in directory or twitter-images.

## Changelog
### Version 0.2.3
Added:
- Extract images from all twitter links in a message - if none of them have images then send no images found
  - If only some have images, send only those links and ignore the others

### Version 0.2.2
Fixed:
- Fix issues with other image types e.g. png

### Version 0.2.1
Fixed:
- The image previously extracted was not of the size of the original post. Fixed.
- Add <> around the twitter link the images were taken from to remove the discord embed for that link only
- Message replaced with '^' and twitter link used instead of original message

### Version 0.2.0
Fixed:
- Discord.js updated to ver 14.16.3. Code updated to work with new version e.g. added intents.

Added:
- the bot can now respond to messages in threads

### Version 0.1.0
The bot has basic functionality.

Features:
- respond to mentions only
- check a twitter/x link is posted (if vx or fx also ok) 
  - take only the first twitter link if there's more than one
- access the twitter link and find all images in the tweet
- extract and send all images in discord, along with the original message (excluding the mention of the bot)
  - e.g. original message was: x.com/someuser/status/1234567 some_message_here @Twitter Images (the ping may be anywhere)
  - the response should be: x.com/someuser/status/1234567 some_message_here [image attachments]
- respond appropriately if no images found
- can:
  - extract and send 1 image
  - extract and send all/multiple images

## Possible Future Features:
- handle no images; ignore images that are part of quote retweets
- respond to messages containing only the bot mention, where the user is replying to a message containing a suitable twitter link, and extract images from all links there, replying to the message that contained the link/s
- extract images from spoilered images - this is difficult because non-logged in users generally aren't able to view spoilered images
