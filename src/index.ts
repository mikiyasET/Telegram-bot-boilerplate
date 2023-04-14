import morgan from "morgan";
import {PrismaClient} from '@prisma/client'
import base from "./base";

const cors = require('cors');
import {errorMiddleWare} from "./error";
import onText from "./core/text";
import type {Update} from "telegraf/types";
import onCallback from "./core/callback";
import {Context, session, Telegraf} from "telegraf";
import path from "path";
import onPreCheckoutQuery from "./core/preCheckout";
import onSuccessfulPayment from "./core/onSuccessfulPayment";
import onChannel from "./core/channel";
import onJoinRequest from "./core/onJoin";
import {UserController} from "./controllers/UserController";
import {AdminController} from "./controllers/AdminController";

const {I18n} = require('telegraf-i18n');
const express = require('express')
const app = express();
const port = process.env.PORT ?? 3000;
const prisma = new PrismaClient();

interface MyContext<U extends Update = Update> extends Context<U> {
    session: {
        list: any,
        selected: string,
        step: number,
        inline_message_id: string,
    },
}

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!);
const i18n = new I18n({
    locales: ['en', 'am', 'ar', 'bn', 'de', 'es', 'fr', 'hi', 'id', 'pt', 'ru', 'zh'],
    directory: path.resolve('./locales'),
    defaultLanguage: 'en',
    sessionName: 'session',
    useSession: true,
    allowMissing: false,
})
bot.use(session({defaultSession: () => ({list: [], selected: "", step: 0,inline_message_id: ""})}));
bot.use(i18n.middleware());
if (onText(bot)) {

} else if (onCallback(bot)) {

} else if (onPreCheckoutQuery(bot)) {

} else if (onSuccessfulPayment(bot)) {

} else if (onChannel(bot)) {

} else if (onJoinRequest(bot)) {

}

app.use(cors());
app.use(morgan('dev'));
app.use(base);
app.use(errorMiddleWare);

bot.catch((err: any) => {
    try {
        console.log('[+] Bot Error')
        console.log(err);
        bot.telegram.sendMessage(353575758, `${bot.botInfo?.first_name}\n\n` + err.toString().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),{parse_mode: "HTML"});
    } catch (e) {
        console.log(e);
    }
})
prisma.$connect().then(() => {
    console.log(`[+] Database connected`);
}).catch((error: any) => {
    console.log(`[-] Database not connected`);
    console.log(error);
});
app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`);
    // @ts-ignore
    await bot.launch({allowedUpdates: ['chat_member', 'message', 'callback_query', 'pre_checkout_query', 'successful_payment']});
});