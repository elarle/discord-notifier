# Ez Message Sender

1º Install 
```bash
bun install 
```
2º Setup token, replace token with your bot token
```bash
echo DST=token >> .env 
```
3º Run
```bash
bun index.js
```
How to use:
You first need to run `list` command before all
Next you can list your servers with `list s`and the channels with `list s <index of the channel>`
You cand send a message with `send <server_index> <channel_index> Hello world!`
