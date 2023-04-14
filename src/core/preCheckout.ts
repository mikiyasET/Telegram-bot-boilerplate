import {UserController} from "../controllers/UserController";

const onPreCheckoutQuery = (bot: any) => {
    bot.on('pre_checkout_query', async (ctx: any) => {
        try {
            const data = ctx.update.pre_checkout_query.invoice_payload.split(':');
            const userId = data[0];
            if ((await UserController.checkValidity(userId)) != null) {
                await ctx.answerPreCheckoutQuery(true);
                return true;
            } else {
                await ctx.answerPreCheckoutQuery(false, "\nYou are not allowed");
                return true;
            }
        } catch (e) {
            await ctx.answerPreCheckoutQuery(false, "\nThere was an error, please try again");
            return false;
        }
    });
    return false;
}

export default onPreCheckoutQuery;