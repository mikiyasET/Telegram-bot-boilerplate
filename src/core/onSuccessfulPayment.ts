import {Basic} from "../messages/Basic";
import {TalkerController} from "../controllers/BotTalkers";
import {UserController} from "../controllers/UserController";
import {AdminController} from "../controllers/AdminController";
import {BrainText} from "../brains/brainText";
import {BrainPayment} from "../brains/brainPayment";

const {Extra, Markup} = require('telegraf');
const onSuccessfulPayment = (bot: any) => {
    bot.on('successful_payment', async (ctx: any, next: any) => {
        const brain = new BrainPayment(ctx);
        await brain.init();
        return true;
    });
    return false;
}

export default onSuccessfulPayment;