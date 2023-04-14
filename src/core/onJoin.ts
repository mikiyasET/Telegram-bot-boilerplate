import {UserController} from "../controllers/UserController";
import {AdminController} from "../controllers/AdminController";
const { Extra, Markup } = require('telegraf');
const onJoin = (bot:any) => {
    bot.on('chat_member', async (ctx:any,next:any) => {
        try {
            // ctx.update.message = ctx.update.channel_post;
            const channel = ctx.update.chat_member.chat;
            /*
            { id: -1001410494893, title: 'bot test', type: 'channel' }
            */
            const user = ctx.update.chat_member.new_chat_member;
            /*
             {
                  user: {
                    id: 1482798448,
                    is_bot: false,
                    first_name: 'Unkkkk',
                    username: 'Itsmezeki00',
                    language_code: 'en'
                  },
                  status: 'member'
                }
            * */
            if (user.status == "member") {
                const usr = await UserController.getByTelegramId(user.user.id.toString());
                if (usr != null) {
                    return true;
                }else {
                    try {
                        await ctx.telegram.banChatMember(channel.id, user.user.id, undefined, {revoke_messages: true});
                        await ctx.telegram.unbanChatMember(channel.id, user.user.id, {only_if_banned: false});
                        await ctx.telegram.revokeChatInviteLink(channel.id, ctx.update.chat_member.invite_link.invite_link)
                    } catch (e: any) {
                        const description = e.description.toString().replace("Bad Request: ", "").replace("Forbidden: ", "");
                        const admins = await AdminController.getAll()
                        for (const admin of admins) {
                            const user = await UserController.get(admin.user_id);
                            if (user != null) {
                                await bot.telegram.sendMessage(user.tg_id, `<b>Bot can't remove user (${user.id}) from ${channel.name}</b>\n\n<u>Reason</u>\n<i>${description}</i>`, {parse_mode: "HTML"})
                            }
                        }
                    }
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    });
    return false;
}

export default onJoin;