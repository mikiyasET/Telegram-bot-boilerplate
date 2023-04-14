import {BrainText} from "../brains/brainText";
const onText = (bot:any) => {
    try {
        bot.on('text', async (ctx: any) => {
            const brain = new BrainText(ctx);
            await brain.init();
            return true;
        });
        return false;
    } catch (e) {
        return false;
    }
}

export default onText;