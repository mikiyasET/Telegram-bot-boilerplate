import {Basic} from "../messages/Basic";
import {AdminRole, Language, talker, user} from "@prisma/client";
import {UserController} from "../controllers/UserController";
import {TalkerController} from "../controllers/BotTalkers";
import {AdminController} from "../controllers/AdminController";
import {convertToBoolean, isNumber, pluralOrSingular, stringify} from "../utils/functions";
import {UserManagement} from "../messages/UserManagement";

require('dotenv').config();

export class BrainJoin {
    private ctx; // the context of the message
    private chat; // the chat object
    private chat_member; // the chat member object
    private chat_id?: number; // the text of the message
    private chat_name?: string; // the text of the message
    private chat_type?: string; // the text of the message
    private readonly id?: number; // the id of the chat
    private readonly first_name?: string; // the first name of the user
    private readonly last_name?: string; // the last name of the user
    private readonly username?: string; // the username of the user
    private status?: string; // the status of the user
    private invite_link; // the invite object
    private link?: string; // the invite link
    private is_join_request?: boolean; // whether the user is a join request
    private is_revoked?: boolean; // whether the invite link is revoked

    private isBot?: boolean; // whether the user is a bot
    private isAdmin; // whether the user is an admin
    private user;

    constructor(ctx: any) {
        this.ctx = ctx;
        this.chat_member = ctx.update.chat_member;
        this.chat = ctx.update.chat_member.chat;
        if (this.chat != undefined) {
            this.chat_id = this.chat.id;
            this.chat_name = this.chat.title;
            this.chat_type = this.chat.type;
        }
        this.invite_link = ctx.update.chat_member.invite_link;
        if (this.invite_link != undefined) {
            this.link = this.invite_link.invite_link;
            this.is_join_request = this.invite_link.creates_join_request;
            this.is_revoked = this.invite_link.is_revoked;
        }
        this.user = ctx.update.chat_member.new_chat_member;
        if (this.user != undefined) {
            this.id = this.user.user.id;
            this.first_name = this.user.user.first_name;
            this.last_name = this.user.user.last_name;
            this.username = this.user.user.username;
            this.status = this.user.status;
            this.isBot = this.user.user.is_bot;
        }
        this.isAdmin = false;
    }

    async init() {
        if (this.status == "member") {
            const usr = await UserController.getByTelegramId(this.id!.toString());
            if (usr != null) {
                return true;
            }else {
                try {
                    await this.ctx.telegram.banChatMember(this.chat_id, this.id, undefined, {revoke_messages: true});
                    await this.ctx.telegram.unbanChatMember(this.chat_id, this.id, {only_if_banned: false});
                    await this.ctx.telegram.revokeChatInviteLink(this.chat_id, this.invite_link)
                } catch (e: any) {
                    console.log(e)
                    const description = e.description.toString().replace("Bad Request: ", "").replace("Forbidden: ", "");
                    if (description == "INVITE_HASH_EXPIRED")
                        return;
                    const admins = await AdminController.getAll()
                    for (const admin of admins) {
                        const user = await UserController.get(admin.user_id);
                        if (user != null) {
                            await this.ctx.telegram.sendMessage(user.tg_id, `<b>Bot can't remove user (${user.id}) from ${this.chat_name}</b>\n\n<u>Reason</u>\n<i>${description}</i>`, {parse_mode: "HTML"})
                        }
                    }
                }
            }
        }
    }
}