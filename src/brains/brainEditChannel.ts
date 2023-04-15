import {Basic} from "../messages/Basic";
import {AdminRole, Language, talker, user} from "@prisma/client";
import {UserController} from "../controllers/UserController";
import {TalkerController} from "../controllers/BotTalkers";
import {AdminController} from "../controllers/AdminController";
import {convertToBoolean, isNumber, pluralOrSingular, stringify} from "../utils/functions";
import {UserManagement} from "../messages/UserManagement";

require('dotenv').config();

export class BrainEditChannel {
    private ctx; // the context of the message
    private chat; // the chat object
    private text: string; // the text of the message
    private readonly id?: number; // the id of the chat
    private readonly first_name?: string; // the first name of the user
    private readonly last_name?: string; // the last name of the user
    private readonly username?: string;
    private readonly chat_id?: number; // the text of the message
    private readonly chat_name?: string; // the text of the message
    private readonly chat_type?: string; // the text of the message

    private edited_channel_post; // the edit channel post object
    private message_id?: number; // the message id
    private author_signature?: string; // the author signature
    private sender_chat; // the sender chat object

    private isBot?: boolean; // whether the user is a bot


    constructor(ctx: any) {
        console.log(ctx.update.edited_channel_post)
        this.ctx = ctx;
        this.edited_channel_post = ctx.update.edited_channel_post;
        this.message_id = this.edited_channel_post.message_id;
        this.author_signature = this.edited_channel_post.author_signature;
        this.text = this.edited_channel_post.text;
        this.chat = this.edited_channel_post.chat;
        if (this.chat != undefined) {
            this.chat_id = this.chat.id;
            this.chat_name = this.chat.title;
            this.chat_type = this.chat.type;
        }
        this.sender_chat = this.edited_channel_post.sender_chat;
        if (this.sender_chat != undefined) {
            this.id = this.sender_chat.id;
            this.first_name = this.sender_chat.first_name;
            this.last_name = this.sender_chat.last_name;
            this.username = this.sender_chat.username;
            this.isBot = this.sender_chat.is_bot;
        }
    }

    async init() {}
}