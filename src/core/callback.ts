import {BrainCallback} from "../brains/brainCallback";

const { Extra, Markup } = require('telegraf');
const onCallback = (bot:any) => {
    bot.on('callback_query', async (ctx:any) => {
        const brain = new BrainCallback(ctx);
        await brain.init();
        return true;
    });
    return false;
}

export default onCallback;