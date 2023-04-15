import {BrainText} from "../brains/brainText";
const onOther = (bot:any) => {
    try {
        bot.on('message', async (ctx: any) => {
            await ctx.reply(ctx.i18n.t('botConfused'), {parse_mode: "HTML"});
            return true;
        });
        return false;
    } catch (e) {
        return false;
    }
}

export default onOther;