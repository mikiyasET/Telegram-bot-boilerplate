# Telegram-bot-boilerplate

## .env file includes

insert this in .env file

>PORT=3000\
IS_INLINE=true\
BOT_TOKEN=XXXXXXXXX:XXXXXXXXXXXXXXXXXXX-XXXXXXXXX\
PAYMENT_KEY=XXXXXXXXXXXXX:XXXX:XXXXXXXXXXXX\
DATABASE_URL=mysql://user:pass@DBHOST:3306/dbname


`/ban USER_ID DAY` to ban user for a limited day\
`/ban USER_ID` to ban user **permanently**\
`/unban USER_ID` to unban user\
`/invoice` to get a custom invoice for this to work you need to set `PAYMENT_KEY` in .env file

`/start and /restart` to start or restart the bot
