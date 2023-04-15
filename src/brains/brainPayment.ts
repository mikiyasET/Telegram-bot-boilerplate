import {Basic} from "../messages/Basic";
import {AdminRole, Language, talker, user} from "@prisma/client";
import {UserController} from "../controllers/UserController";
import {TalkerController} from "../controllers/BotTalkers";
import {AdminController} from "../controllers/AdminController";
import {convertToBoolean, isNumber, pluralOrSingular, stringify} from "../utils/functions";
import {UserManagement} from "../messages/UserManagement";

require('dotenv').config();

export class BrainPayment {
    private ctx; // the context of the message
    private chat; // the chat object
    private text: string; // the text of the message
    private readonly id: number; // the id of the chat
    private readonly first_name?: string; // the first name of the user
    private readonly last_name?: string; // the last name of the user
    private readonly username?: string; // the username of the user
    private isAdmin; // whether the user is an admin

    private success;
    private currency;
    private total_amount;
    private invoice_payload;
    private telegram_payment_charge_id;
    private provider_payment_charge_id;

    private basicMessages; // the basic messages object
    private userMessages; // the user management messages object

    constructor(ctx: any) {
        this.ctx = ctx;
        this.text = ctx.message.text;
        this.chat = ctx.message.chat;
        this.id = this.chat.id;
        this.first_name = this.chat.first_name;
        this.last_name = this.chat.last_name;
        this.username = this.chat.username;
        this.success = ctx.message.successful_payment;
        this.currency = this.success.currency;
        this.total_amount = this.success.total_amount;
        this.invoice_payload = this.success.invoice_payload;
        this.telegram_payment_charge_id = this.success.telegram_payment_charge_id;
        this.provider_payment_charge_id = this.success.provider_payment_charge_id;
        this.basicMessages = new Basic(ctx);
        this.userMessages = new UserManagement(ctx);
        this.isAdmin = false;
    }

    async init() {
        const basicMessages = new Basic(this.ctx);
        await basicMessages.init();
        const success = this.ctx.message.successful_payment;
        const data = success.invoice_payload.split(':');
        const userId = data[0]; // id
        const user = await UserController.getByTelegramId(this.ctx.message.chat.id.toString());
        if (user != null) {
            const talker = await TalkerController.getByUserId(user.id);
            await this.ctx.reply(this.ctx.i18n.t("paymentSuccessMSG"), {parse_mode: "HTML"})
            if (talker != null) {
                await TalkerController.talk({
                    user_id: user.id,
                    pre_request: talker.request,
                    request: "menu",
                    waiting: true,
                });
                let isAdmin = false;
                const admin = await AdminController.getByUserId(user!.id)
                isAdmin = admin != null;
                isAdmin ? await basicMessages.adminMenu() : await basicMessages.userMenu();
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t("planBuyFailedMSG"), {parse_mode: "HTML"})
        }
    }

}