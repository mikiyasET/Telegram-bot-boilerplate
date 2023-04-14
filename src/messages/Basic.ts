import {BasicKYB} from "../keyboards/normal/Basic";
import {BasicIKYB} from "../keyboards/inline/Basic";
import {UserController} from "../controllers/UserController";
import {TalkerController} from "../controllers/BotTalkers";
import {Language, talker, user} from "@prisma/client";
import {AdminController} from "../controllers/AdminController";
import {sendInvoice} from "../types/invoice";
import {convertToBoolean, getCurrency, stringify} from "../utils/functions";

export class Basic {
    public user: user | undefined;
    public talker: talker | undefined;

    private id: number;
    private readonly ctx: any;

    public basicKYB: BasicKYB;
    public basicIKYB: BasicIKYB;
    public readonly username?: string;
    public readonly last_name?: string;
    public readonly first_name?: string;
    public readonly isCallback: boolean = false;

    constructor(ctx: any) {
        this.ctx = ctx;
        this.basicKYB = new BasicKYB(this.ctx);
        this.basicIKYB = new BasicIKYB(this.ctx);
        if (this.ctx.callbackQuery !== undefined) {
            this.isCallback = true;
            this.id = ctx.callbackQuery.message.chat.id;
            this.first_name = ctx.callbackQuery.message.chat.first_name;
            this.last_name = ctx.callbackQuery.message.chat.last_name;
            this.username = ctx.callbackQuery.message.chat.username;
        } else {
            this.isCallback = false;
            this.id = ctx.message.chat.id;
            this.first_name = ctx.message.chat.first_name;
            this.last_name = ctx.message.chat.last_name;
            this.username = ctx.message.chat.username;
        }
    }

    async init(init = false) {
        const user = await UserController.getByTelegramId(this.id.toString());
        if (user != null) {
            this.user = user;
            const talker = await TalkerController.getByUserId(this.user.id);
            if (talker != null) {
                this.talker = talker;
            }
            return true;
        } else {
            if (!init)
                await this.userNotFound();
            return false;
        }
    }

    async account() {
        if (this.user != undefined) {
            if (convertToBoolean(process.env.IS_INLINE)) {
                this.talker = await TalkerController.talk({
                    user_id: this.user!.id,
                    pre_request: this.talker?.request,
                    request: "account",
                    waiting: true,
                }) ?? undefined;
                await this.ctx.editMessageText(this.ctx.i18n.t('accountMSG', {
                    name: this.user!.first_name,
                }), this.basicIKYB.back()).catch((e: any) => {
                    console.log("[+] Edit error")
                    console.log(e)
                });
            } else {
                if (this.isCallback) {
                    await this.ctx.editMessageText(this.ctx.i18n.t('accountMSG', {
                        name: this.user!.first_name,
                    }), this.basicIKYB.userMenu()).catch((e: any) => {
                        console.log("[+] Edit error")
                        console.log(e)
                    });
                } else {
                    await this.ctx.reply(this.ctx.i18n.t("accountMSG", {
                        name: this.user!.first_name,
                    }), {parse_mode: "HTML"})
                }
            }
        } else {
            await this.unknownCommand()
        }
    }

    async language() {
        if (this.user != undefined) {
            this.talker = await TalkerController.talk({
                user_id: this.user!.id,
                pre_request: this.talker?.request,
                request: "language",
                waiting: true,
            }) ?? undefined;
            if (convertToBoolean(process.env.IS_INLINE)) {
                if (this.isCallback) {
                    await this.ctx.editMessageText(this.ctx.i18n.t("languageMSG"), this.basicIKYB.language());
                    return;
                }
            } else {
                await this.ctx.reply(this.ctx.i18n.t("languageMSG"), this.basicKYB.language())
                return;
            }
            await this.unknownCommand();
            return;
        }
    }

    async settings() {
        this.talker = await TalkerController.talk({
            user_id: this.user!.id,
            pre_request: this.talker?.request,
            request: "settings",
            waiting: true,
        }) ?? undefined;
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.isCallback) {
                await this.ctx.editMessageText(this.ctx.i18n.t("settingsMSG"), this.basicIKYB.settings());
                return;
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t("settingsMSG"), this.basicKYB.settings());
            return;
        }
        await this.unknownCommand();
    }

    async userMenu() {
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.isCallback) {
                if (stringify(this.ctx.session.inline_message_id) == null) {
                    this.ctx.session.inline_message_id = this.ctx.callbackQuery.message.message_id;
                }
                await this.ctx.editMessageText(this.ctx.i18n.t('menuMSG'), this.basicIKYB.userMenu()).catch((e: any) => {
                });
                return;
            } else {
                if (stringify(this.ctx.session.inline_message_id) != null) {
                    await this.ctx.deleteMessage(this.ctx.session.inline_message_id).catch((e: any) => {
                    });
                }
                const message = await this.ctx.reply(this.ctx.i18n.t('menuMSG'), this.basicIKYB.userMenu());
                this.ctx.session.inline_message_id = message.message_id;
                return;
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t('menuMSG'), this.basicKYB.userMenu())
            return;
        }
    }

    async adminMenu() {
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.isCallback) {
                if (stringify(this.ctx.session.inline_message_id) == null) {
                    this.ctx.session.inline_message_id = this.ctx.callbackQuery.message.message_id;
                }
                await this.ctx.editMessageText(this.ctx.i18n.t('menuMSG'), this.basicIKYB.adminMenu()).catch((e: any) => {
                });
                return;
            } else {
                if (stringify(this.ctx.session.inline_message_id) != null) {
                    await this.ctx.deleteMessage(this.ctx.session.inline_message_id).catch((e: any) => {
                    });
                }
                const message = await this.ctx.reply(this.ctx.i18n.t('menuMSG'), this.basicIKYB.adminMenu());
                this.ctx.session.inline_message_id = message.message_id;
                return;
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t('menuMSG'), this.basicKYB.adminMenu())
            return;
        }
    }

    async invalidInput() {
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.isCallback) {
                await this.ctx.answerCbQuery(this.ctx.i18n.t('userNotFoundMSG'), {show_alert: true});
                return;
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t('invalidInputMSG'), {parse_mode: "HTML"});
            return;
        }
        await this.unknownCommand();
    }

    async userIdRequired() {
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.isCallback) {
                await this.ctx.answerCbQuery(this.ctx.i18n.t('userIdRequiredMSG'), {show_alert: true});
                return;
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t('userIdRequiredMSG'), {parse_mode: "HTML"});
            return;
        }
        await this.unknownCommand();
    }

    async userNotFound() {
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.isCallback) {
                await this.ctx.answerCbQuery(this.ctx.i18n.t('userNotFoundMSG'), {show_alert: true});
                return;
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t('userNotFoundMSG'));
            return;
        }
        await this.unknownCommand();
    }

    async unknownCommand() {
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.isCallback) {
                await this.ctx.answerCbQuery(this.ctx.i18n.t('botConfused'), {show_alert: true});
                return;
            } else {
                await this.ctx.reply(this.ctx.i18n.t('botConfused'), {parse_mode: "HTML"});
                return;
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t('botConfused'), {parse_mode: "HTML"});
            return;
        }
    }

    async banned(user: user) {
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.isCallback) {
                await this.ctx.answerCbQuery(this.ctx.i18n.t("bannedMSG", {date: user.banUntil == null ? "Forever" : user.banUntil.toLocaleString()}), {show_alert: true});
                return;
            }else {
                await this.ctx.deleteMessage(this.ctx.session.inline_message_id).catch((e: any) => {});
                const msg = await this.ctx.reply(this.ctx.i18n.t("bannedMSG", {date: user.banUntil == null ? "Forever" : user.banUntil.toLocaleString()}), {parse_mode: "HTML"});
                this.ctx.session.inline_message_id = msg.message_id;
                return;
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t("bannedMSG", {date: user.banUntil == null ? "Forever" : user.banUntil.toLocaleString()}), {parse_mode: "HTML"});
            return;
        }
        await this.unknownCommand();
    }

    async underConstruction() {
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.isCallback) {
                await this.ctx.answerCbQuery(this.ctx.i18n.t('underConstruction'), {show_alert: true});
                return;
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t('underConstruction'), {parse_mode: "HTML"});
            return;
        }
        await this.unknownCommand();
    }

    async changeLang(lang: Language) {
        try {
            let language: Language;
            switch (lang) {
                case "am":
                    language = Language.am;
                    break;
                case "en":
                    language = Language.en;
                    break;
                default:
                    language = Language.en;
                    break;
            }
            await UserController.update(this.user!.id, {language: language})
            this.ctx.i18n.locale(lang);
        } catch (e) {
            console.log("Error changing language: " + e);
        }
    }

    async kick(chat: any, tg_id: number) {
        try {
            await this.ctx.telegram.banChatMember(chat.id, tg_id, undefined, {revoke_messages: true});
            await this.ctx.telegram.unbanChatMember(chat.id, tg_id, {only_if_banned: false});
        } catch (e: any) {
            const description = e.description.toString().replace("Bad Request: ", "").replace("Forbidden: ", "");
            const admins = await AdminController.getAll()
            for (const admin of admins) {
                const user = await UserController.get(admin.user_id);
                if (user != null) {
                    await this.ctx.telegram.sendMessage(tg_id, `<b>Bot can't remove user (${user.id}) from ${chat.name}</b>\n\n<u>Reason</u>\n<i>${description}</i>`, {parse_mode: "HTML"})
                }
            }
        }
    }

    async welcome(init: boolean = false) {
        await this.ctx.reply(this.ctx.i18n.t("welcomeMSG", {name: this.first_name}), {parse_mode: "HTML"})
        if (init) {
            this.talker = await TalkerController.talk({
                user_id: this.user!.id,
                pre_request: "init",
                request: "menu",
                waiting: true,
            }) ?? undefined;
        }
    }

    async sendToAllAdmins(message: string) {
        const admins = await AdminController.getAll()
        for (const admin of admins) {
            const user = await UserController.get(admin.user_id);
            if (user != null) {
                await this.ctx.telegram.sendMessage(user.tg_id, message, {parse_mode: "HTML"})
            }
        }
    }

    async confirm(message: string, request?: string) {
        if (this.user != undefined) {
            if (convertToBoolean(process.env.IS_INLINE)) {
                this.talker = await TalkerController.talk({
                    user_id: this.user!.id,
                    pre_request: this.talker?.request,
                    request: request,
                    waiting: true,
                }) ?? undefined;
                await this.ctx.deleteMessage(this.ctx.session.inline_message_id).catch((e: any) => {});
                const m = await this.ctx.reply(message, this.basicIKYB.yesNo());
                this.ctx.session.inline_message_id = m.message_id;
            } else {
                if (request != undefined) {
                    this.talker = await TalkerController.talk({
                        user_id: this.user!.id,
                        pre_request: this.talker?.request,
                        request: request,
                        waiting: true,
                    }) ?? undefined;
                }
                await this.ctx.reply(message, this.basicKYB.yesNo());
                return;
            }
        } else {
            await this.unknownCommand();
            return;
        }
    }

    async sendInvoice({title, img, description, products, tips, currency, payload}: sendInvoice) {
        const myCurrency = await getCurrency(currency);
        if (myCurrency != null) {
            if (products.length > 0) {
                let maxTip = 0;
                const product = products.map((product: any) => {
                    return {
                        label: product.name,
                        amount: product.price * 100
                    }
                })
                const tip = tips == undefined ? undefined : tips.map((tip: any) => {
                    if (tip > maxTip) {
                        maxTip = tip;
                    }
                    return tip * 100
                });
                const invoice: any = {
                    title: title,
                    photo_url: img, //"https://pbs.twimg.com/media/FtIGHFzXwAYRsGE?format=jpg&name=large",
                    description: description,
                    prices: product,
                    suggested_tip_amounts: tip,
                    max_tip_amount: maxTip,
                    currency: currency,
                    payload: payload,
                    start_parameter: "start",
                    provider_token: process.env.PAYMENT_KEY!
                };
                await this.ctx.replyWithInvoice(invoice);
                return;
            } else {
                if (convertToBoolean(process.env.IS_INLINE)) {
                    if (this.isCallback) {
                        await this.ctx.editMessageText(this.ctx.i18n.t("invalidInvoiceMSG"), this.basicIKYB.yesNo());
                        return;
                    }
                } else {
                    await this.ctx.reply(this.ctx.i18n.t("invalidInvoiceMSG"));
                    return;
                }
            }
        } else {
            if (convertToBoolean(process.env.IS_INLINE)) {
                if (this.isCallback) {
                    await this.ctx.editMessageText(this.ctx.i18n.t("unSupportedCurrencyMSG"), this.basicIKYB.yesNo());
                    return;
                }
            } else {
                await this.ctx.reply(this.ctx.i18n.t("unSupportedCurrencyMSG"));
                return;
            }
        }
        await this.unknownCommand();
    }

    async generateList(array: any[], label: string, row: number): Promise<any[]> {
        let temp = [];
        let list = [];
        let count = 0;
        for (let i = 0; i < array.length; i++) {
            if (count < row) {
                if (this.isCallback) {
                    temp.push({text: array[i][label], callback_data: "list:" + array[i][label]});
                } else {
                    temp.push({text: array[i][label]});
                }
                count++;
            } else {
                list.push(temp);
                temp = [];
                if (this.isCallback) {
                    temp.push({text: array[i][label], callback_data: "list:" + array[i][label]});
                } else {
                    temp.push({text: array[i][label]});
                }
                count = 1;
            }
        }
        if (temp.length > 0) {
            list.push(temp);
        }
        return list;
    }
}