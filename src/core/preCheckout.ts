import {UserController} from "../controllers/UserController";
import {BrainPreCheckout} from "../brains/brainPreCheckout";

const onPreCheckoutQuery = (bot: any) => {
    bot.on('pre_checkout_query', async (ctx: any) => {
        const brain = new BrainPreCheckout(ctx);
        await brain.init();
        return true;
    });
    return false;
}

export default onPreCheckoutQuery;