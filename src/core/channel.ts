import {BrainChannel} from "../brains/brainChannel";

const { Extra, Markup } = require('telegraf');
const onChannel = (bot:any) => {
    bot.on('channel_post', async (ctx:any,next:any) => {
        try {
            const brain = new BrainChannel(ctx);
            await brain.init();
            return true;
        } catch (e) {
            return false;
        }
    });
    return false;
}

export default onChannel;