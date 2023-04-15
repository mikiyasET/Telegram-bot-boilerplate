import {Basic} from "../messages/Basic";
import {AdminRole, Language, talker, user} from "@prisma/client";
import {UserController} from "../controllers/UserController";
import {TalkerController} from "../controllers/BotTalkers";
import {AdminController} from "../controllers/AdminController";
import {convertToBoolean, isNumber, pluralOrSingular, stringify} from "../utils/functions";
import {UserManagement} from "../messages/UserManagement";

require('dotenv').config();

export class BrainChannel {
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

    private channel_post; // the channel post object
    private message_id?: number; // the message id
    private author_signature?: string; // the author signature
    private sender_chat; // the sender chat object
    private isBot?: boolean; // whether the user is a bot
    private photo?: any; // the photo object
    private photo_id?: string; // the id of the photo
    private caption?: string; // the caption of the photo


    constructor(ctx: any) {
        console.log(ctx.update.channel_post)
        this.ctx = ctx;
        this.channel_post = ctx.update.channel_post;
        this.message_id = this.channel_post.message_id;
        this.author_signature = this.channel_post.author_signature;
        this.text = this.channel_post.text;
        this.chat = this.channel_post.chat;
        if (this.chat != undefined) {
            this.chat_id = this.chat.id;
            this.chat_name = this.chat.title;
            this.chat_type = this.chat.type;
        }
        this.sender_chat = this.channel_post.sender_chat;
        if (this.sender_chat != undefined) {
            this.id = this.sender_chat.id;
            this.first_name = this.sender_chat.first_name;
            this.last_name = this.sender_chat.last_name;
            this.username = this.sender_chat.username;
            this.isBot = this.sender_chat.is_bot;
        }
        this.photo = this.channel_post.photo;
        if (this.photo != undefined) {
            this.photo_id = this.photo[this.photo.length - 1].file_id;
        }
        this.caption = this.channel_post.caption;
    }

    async init() {}
}