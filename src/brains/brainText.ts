import {Basic} from "../messages/Basic";
import {AdminRole, Language, talker, user} from "@prisma/client";
import {UserController} from "../controllers/UserController";
import {TalkerController} from "../controllers/BotTalkers";
import {AdminController} from "../controllers/AdminController";
import {convertToBoolean, isNumber, pluralOrSingular, stringify} from "../utils/functions";
import {UserManagement} from "../messages/UserManagement";

require('dotenv').config();

export class BrainText {
    private ctx;
    private chat;
    private text: string;
    private readonly id: number;
    private readonly first_name?: string;
    private readonly last_name?: string;
    private readonly username?: string;
    private isAdmin;

    private user: user | undefined;
    private talker: talker | undefined;
    private basicMessages;
    private userMessages;

    constructor(ctx: any) {
        this.ctx = ctx;
        this.text = ctx.message.text;
        this.chat = ctx.message.chat;
        this.id = this.chat.id;
        this.first_name = this.chat.first_name;
        this.last_name = this.chat.last_name;
        this.username = this.chat.username;
        this.basicMessages = new Basic(ctx);
        this.userMessages = new UserManagement(ctx);
        this.isAdmin = false;
    }

    async init() {
        const user = await UserController.getByTelegramId(this.id.toString()) ?? undefined;
        if (user != undefined) {
            await this.basicMessages.init();
            await this.userMessages.init();
            this.user = user;
            this.ctx.i18n.locale(this.user.language);
            const admin = await AdminController.getByUserId(this.user!.id);
            this.isAdmin = admin != null;
            if ((this.isAdmin && admin?.role == AdminRole.superadmin) || this.user.status) {
                const talker = await TalkerController.getByUserId(this.user.id);
                if (talker != null) {
                    this.talker = talker;
                    await this.manageTalker();
                }
            } else {
                await this.basicMessages.banned(this.user);
            }
        } else {
            await this.basicMessages.init(true);
            await this.ctx.i18n.locale("en");
            const u = (await UserController.create({
                tg_id: this.id.toString(),
                first_name: this.first_name,
                last_name: this.last_name,
                username: this.username,
            })) ?? undefined;
            this.basicMessages.user = u;
            this.user = u;
            if (this.user != undefined) {
                await this.manageTalker();
            } else {
                throw new Error("User not created");
            }
        }
    }

    async manageTalker() {
        if (this.talker == undefined) {
            await this.basicMessages.welcome(true);
            await this.back("menu");
        } else {
            this.text = this.text[0] == '/' ? this.text.slice(1) : this.text;
            if (!convertToBoolean(process.env.IS_INLINE)) {
                if (this.basicMessages.talker != null && this.basicMessages.talker.waiting) {
                    await this.watch();
                } else {
                    await this.handleRequest();
                }
            } else {
                const textArray = this.text.split(" ");
                if (this.text == "start" || this.text == "restart") {
                    await this.back("menu");
                } else if (textArray[0] == "ban") {
                    if (textArray.length > 1) {
                        const id = textArray[1];
                        const day = textArray.length == 2 ? "unlimited" : textArray[2];
                        if (stringify(id) != null && stringify(day) != null) {
                            const user = await UserController.get(id);
                            if (user != null) {
                                if (user.status) {
                                    if (isNumber(day) || day == "unlimited") {
                                        this.ctx.session.selected = `${user.id}:${day}`;
                                        this.basicMessages.confirm(this.ctx.i18n.t("confirmBanMSG", {
                                            name: user.first_name,
                                            day: day == "unlimited" ? this.ctx.i18n.t('foreverMSG') : day + " " + pluralOrSingular("day", parseInt(day), this.ctx)
                                        }), "confirmBan");
                                    }
                                }else {
                                    await this.ctx.answerCbQuery(this.ctx.i18n.t('userAlreadyBanned'), {show_alert: true});
                                }
                            } else {
                                await this.basicMessages.userNotFound();
                            }
                        } else {
                            await this.basicMessages.invalidInput();
                        }
                    } else {
                        await this.basicMessages.userIdRequired();
                    }
                }
                else if (this.text.split(" ")[0] == "unban") {
                    if (textArray.length > 1) {
                        const id = textArray[1];
                        if (stringify(id) != null) {
                            const user = await UserController.get(id);
                            if (user != null) {
                                    this.ctx.session.selected = user.id;
                                    this.basicMessages.confirm(this.ctx.i18n.t("confirmUnbanMSG", {
                                        name: user.first_name,
                                    }), "confirmUnban");
                                }
                            } else {
                                await this.basicMessages.userNotFound();
                            }
                    } else {
                        await this.basicMessages.userIdRequired();
                    }
                } else {
                    await this.basicMessages.unknownCommand();
                }
            }
        }
    }

    async watch() {
        if (this.text == "start" || this.text == "restart") {
            await this.back("menu");
        } else if (this.text == "invoice") {
            if (this.basicMessages.user != null) {
                await this.basicMessages.sendInvoice({
                    title: "Invoice",
                    description: "Invoice description",
                    products: [
                        {
                            name: "Product 1",
                            price: 100,
                        },
                        {
                            name: "Product 2",
                            price: 200,
                        }
                    ],
                    currency: "ETB",
                    payload: `${this.basicMessages.user.id}:mypayload`
                });
            } else {
                await this.basicMessages.unknownCommand();
            }
        } else {
            switch (this.basicMessages.talker?.request) {
                case "menu":
                    switch (this.text) {
                        case this.ctx.i18n.t("accountBTN"):
                            await this.basicMessages.account();
                            break;
                        case this.ctx.i18n.t("settingsBTN"):
                            await this.basicMessages.settings();
                            break;
                        case this.ctx.i18n.t("userManagementBTN"):
                            if (this.isAdmin) {
                                await this.userMessages.menu();
                            } else {
                                await this.basicMessages.unknownCommand();
                            }
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                            break;
                    }
                    break;
                case "settings":
                    switch (this.text) {
                        case this.ctx.i18n.t("backBTN"):
                            await this.back("menu");
                            break;
                        case this.ctx.i18n.t("languageBTN"):
                            await this.basicMessages.language();
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                    }
                    break;
                case "language":
                    switch (this.text) {
                        case this.ctx.i18n.t("backBTN"):
                            await this.back("settings");
                            break;
                        case "🇪🇹 አማርኛ":
                            await this.basicMessages.changeLang("am");
                            await this.back("settings");
                            break;
                        case "🇬🇧 English":
                            await this.basicMessages.changeLang("en");
                            await this.back("settings");
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                    }
                    break;
                case "userManagement":
                    switch (this.text) {
                        case this.ctx.i18n.t("backBTN"):
                            await this.back("menu");
                            break;
                        case this.ctx.i18n.t("usersBTN"):
                            await this.userMessages.showAllUsers();
                            break;
                        case this.ctx.i18n.t("bannedUsersBTN"):
                            await this.userMessages.showBannedUsers();
                            break;
                        case this.ctx.i18n.t("statusBTN"):
                            await this.userMessages.stats();
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                            break
                    }
                    break;
                case "userManagementIn":
                    switch (this.text) {
                        case this.ctx.i18n.t("backBTN"):
                            await this.back("userManagement");
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                            break
                    }
                    break;
                case "confirmBan":
                    switch (this.text) {
                        case this.ctx.i18n.t("noBTN"):
                        case this.ctx.i18n.t("backBTN"):
                            await this.back("userManagement");
                            break;
                        case "yes":
                            await this.userMessages.ban();
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                            break;
                    }
                    break;
                case "confirmUnban":
                    switch (this.text) {
                        case this.ctx.i18n.t("noBTN"):
                        case this.ctx.i18n.t("backBTN"):
                            await this.back("userManagement");
                            break;
                        case this.ctx.i18n.t("yesBTN"):
                            await this.userMessages.unban();
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                            break;
                    }
                    break;
                default:
                    await this.basicMessages.unknownCommand();
                    break;
            }
        }
    }

    async handleRequest() {
        switch (this.text) {
            case 'start':
            case 'restart':
                await this.basicMessages.welcome();
                await this.back("menu")
                break;
            default:
                await this.basicMessages.unknownCommand()
                break;
        }
    }

    async back(to: string) {
        if (to == "menu") {
            this.talker = await TalkerController.talk({
                user_id: this.user!.id,
                pre_request: this.talker?.request,
                request: "menu",
                waiting: true,
            }) ?? undefined;
            this.ctx.session.list = [];
            this.ctx.session.selected = "";
            this.isAdmin ? await this.basicMessages.adminMenu() : await this.basicMessages.userMenu();
        } else if (to == "settings") {
            this.talker = await TalkerController.talk({
                user_id: this.user!.id,
                pre_request: this.talker?.request,
                request: "settings",
                waiting: true,
            }) ?? undefined;
            await this.basicMessages.settings();
        } else {
            throw new Error("Unknown back to command");
        }
    }
}