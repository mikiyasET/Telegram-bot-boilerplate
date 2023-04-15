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

## Use of .env file

> **PORT** is the port number on which the bot will run

> **IS_INLINE** is a boolean value to set the bot keyboard to be inline or normal keyboards

> **PAYMENT_KEY** is the payment key for the bot to work with payments if not ignore this

> **BOT_TOKEN** is the bot token that you get from @BotFather

> **DATABASE_URL** is the database url for the bot to work with database if not ignore this


## Setup database

1. Run `npm install` to install prisma locally
2. Run `npx prisma migrate dev --name init` to create the database
3. Run `npx prisma generate` to generate the prisma client

## How to use

1. Clone this repo
2. Run `npm install`
3. Run `npm run serve` to start the bot in development mode
4. Run `npm run build` to build the bot
5. Run `npm run start` to start the bot in production mode

## Dev

- Mikiyas Lemlemu

  > [Telegram](https://t.me/m_miko)

  > [Twitter](https://twitter.com/mikiyaslemlemu)
  
  > [Email](mikiyas.lemlemu.aw7024@gmail.com)

## License & copyright

© Mikiyas Lemlemu 📍 ETHIOPIA 🇪🇹

### Donate

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/N4N51K3IH)
