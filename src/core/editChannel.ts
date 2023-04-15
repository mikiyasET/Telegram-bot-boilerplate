import {BrainChannel} from "../brains/brainChannel";
import {BrainEditChannel} from "../brains/brainEditChannel";

const { Extra, Markup } = require('telegraf');
const onEditChannel = (bot:any) => {
    bot.on('edited_channel_post', async (ctx:any,next:any) => {
        try {
            const brain = new BrainEditChannel(ctx);
            await brain.init();
            return true;
        } catch (e) {
            return false;
        }
    });
    return false;
}

export default onEditChannel;