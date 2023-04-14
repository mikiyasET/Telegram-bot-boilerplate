const { Extra, Markup } = require('telegraf');
const onChannel = (bot:any) => {
    bot.on('channel_post', async (ctx:any,next:any) => {
        try {
            
            return true;
        } catch (e) {
            return false;
        }
    });
    return false;
}

export default onChannel;