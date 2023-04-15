import {UserController} from "../controllers/UserController";
import {AdminController} from "../controllers/AdminController";
import {BrainCallback} from "../brains/brainCallback";
import {BrainJoin} from "../brains/brainJoin";
const { Extra, Markup } = require('telegraf');
const onJoin = (bot:any) => {
    bot.on('chat_member', async (ctx:any,next:any) => {
        const brain = new BrainJoin(ctx);
        await brain.init();
        return true;
    });
    return false;
}

export default onJoin;