import {Basic} from "../messages/Basic";
import {TalkerController} from "../controllers/BotTalkers";
import {UserController} from "../controllers/UserController";
import {AdminController} from "../controllers/AdminController";

const {Extra, Markup} = require('telegraf');
const onSuccessfulPayment = (bot: any) => {
    bot.on('successful_payment', async (ctx: any, next: any) => {
        const success = ctx.message.successful_payment;
        const data = success.invoice_payload.split(':');
        const userId = data[0]; // id
        const user = await UserController.getByTelegramId(ctx.message.chat.id.toString());
        if (user != null) {
            const talker = await TalkerController.getByUserId(user.id);
            await ctx.reply(ctx.i18n.t("paymentSuccessMSG"), {parse_mode: "HTML"})
            if (talker != null) {
                await TalkerController.talk({
                    user_id: user.id,
                    pre_request: talker.request,
                    request: "menu",
                    waiting: true,
                });
                const basicMessages = new Basic(ctx);
                let isAdmin = false;
                const admin = await AdminController.getByUserId(user!.id)
                isAdmin = admin != null;
                isAdmin ? await basicMessages.adminMenu() : await basicMessages.userMenu();
            }
        } else {
            await ctx.reply(ctx.i18n.t("planBuyFailedMSG"), {parse_mode: "HTML"})
        }
        return true;
    });
    return false;
}

export default onSuccessfulPayment;