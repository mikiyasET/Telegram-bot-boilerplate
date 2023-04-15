import {Basic} from "../messages/Basic";
import {AdminRole, Language, talker, user} from "@prisma/client";
import {UserController} from "../controllers/UserController";
import {TalkerController} from "../controllers/BotTalkers";
import {AdminController} from "../controllers/AdminController";
import {convertToBoolean, isNumber, pluralOrSingular, stringify} from "../utils/functions";
import {UserManagement} from "../messages/UserManagement";

require('dotenv').config();

export class BrainPreCheckout {
    private ctx; // the context of the request
    private readonly pre_checkout_query_id: number; // the id of pre_checkout_query
    private pre_checkout_query; // the pre_checkout_query object

    private from;
    private id;
    private first_name;
    private last_name;
    private username;
    private is_premium;
    private currency; // the currency of the pre_checkout_query
    private total_amount; // the total amount of the pre_checkout_query
    private invoice_payload; // the invoice_payload of the pre_checkout_query

    constructor(ctx: any) {
        this.ctx = ctx;
        this.pre_checkout_query = ctx.update.pre_checkout_query;
        this.pre_checkout_query_id = this.pre_checkout_query.id;
        this.from = this.pre_checkout_query.from;
        this.id = this.from.id;
        this.first_name = this.from.first_name;
        this.last_name = this.from.last_name;
        this.username = this.from.username;
        this.is_premium = this.from.is_premium;
        this.currency = this.pre_checkout_query.currency;
        this.total_amount = this.pre_checkout_query.total_amount;
        this.invoice_payload = this.pre_checkout_query.invoice_payload;
    }

    async init() {
        try {
            const data = this.invoice_payload.split(':');
            const userId = data[0];
            if ((await UserController.checkValidity(userId)) != null) {
                await this.ctx.answerPreCheckoutQuery(true);
                return true;
            } else {
                await this.ctx.answerPreCheckoutQuery(false, "\nYou are not allowed");
                return true;
            }
        } catch (e) {
            await this.ctx.answerPreCheckoutQuery(false, "\nThere was an error, please try again");
            return false;
        }
    }

}