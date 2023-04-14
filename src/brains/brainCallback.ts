import {Basic} from "../messages/Basic";
import {UserController} from "../controllers/UserController";
import {TalkerController} from "../controllers/BotTalkers";
import {AdminController} from "../controllers/AdminController";
import {user,talker} from "@prisma/client";
import {UserManagement} from "../messages/UserManagement";

require('dotenv').config();

export class BrainCallback {
    private ctx;
    private data: string;
    private chat;
    private readonly id: number;
    private readonly first_name?: string;
    private readonly last_name?: string;
    private readonly username?: string;
    private readonly message_id: number;
    private user: user | undefined;
    private talker: talker | undefined;
    private isAdmin;
    private basicMessages;
    private userMessages;

    constructor(ctx: any) {
        this.ctx = ctx;
        this.data = ctx.callbackQuery.data;
        this.chat = ctx.callbackQuery.message.chat;
        this.message_id = ctx.callbackQuery.message.message_id;
        this.id = this.chat.id;
        this.first_name = this.chat.first_name;
        this.last_name = this.chat.last_name;
        this.username = this.chat.username;
        this.isAdmin = false;
        this.basicMessages = new Basic(ctx);
        this.userMessages = new UserManagement(ctx);
    }

    async init() {
        const user = await UserController.getByTelegramId(this.id.toString()) ?? undefined;
        await this.basicMessages.init();
        await this.userMessages.init();
        if (user != null) {
            this.user = user;
            this.ctx.i18n.locale(this.user.language);
            if (this.user.status) {
                const talker = await TalkerController.getByUserId(this.user.id);
                if (talker != null) {
                    this.talker = talker;
                    await this.manageTalker();
                }
            } else {
                await this.basicMessages.banned(this.user);
            }
        } else {
            this.ctx.i18n.locale("en");
            this.basicMessages.user = this.user = (await UserController.create({
                tg_id: this.id.toString(),
                first_name: this.first_name,
                last_name: this.last_name,
                username: this.username,
            })) ?? undefined;
            if (this.user != undefined) {
                await this.manageTalker();
            } else {
                throw new Error("User not created");
            }
        }
    }

    async manageTalker() {
        if (this.talker == null) {
            await this.basicMessages.welcome(true);
        } else {
            const admin = await AdminController.getByUserId(this.user!.id);
            this.isAdmin = admin != null;
            if (this.basicMessages.talker != null && this.basicMessages.talker.waiting) {
                console.log("Waiting for user input")
                await this.watch();
            } else {
                console.log("Waiting for user request")
                await this.handleRequest();
            }
        }
    }

    async watch() {
        if (this.data == "start" || this.data == "restart") {
            await this.back("menu");
        }
        else if (this.data == "invoice") {
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
        }
        else {
            console.log(this.basicMessages.talker?.request)
            switch (this.basicMessages.talker?.request) {
                case "menu":
                    switch (this.data) {
                        case "account":
                            await this.basicMessages.account();
                            break;
                        case "settings":
                            await this.basicMessages.settings();
                            break;
                        case "userManagement":
                            if (this.isAdmin) {
                                await this.userMessages.menu();
                            }
                            else {
                                await this.basicMessages.unknownCommand();
                            }
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                            break;
                    }
                    break;
                case "settings":
                    switch (this.data) {
                        case "back":
                            await this.back("menu");
                            break;
                        case "language":
                            await this.basicMessages.language();
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                    }
                    break;
                case "language":
                    switch (this.data) {
                        case "back":
                            await this.back("settings");
                            break;
                        case "lang_am":
                            await this.basicMessages.changeLang("am");
                            await this.back("settings");
                            break;
                        case "lang_en":
                            await this.basicMessages.changeLang("en");
                            await this.back("settings");
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                    }
                    break;
                case "account":
                    switch (this.data) {
                        case "back":
                            await this.back("menu");
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                            break
                    }
                    break;
                case "userManagement":
                    switch (this.data) {
                        case "back":
                            await this.back("menu");
                            break;
                        case "show_all_users":
                            await this.userMessages.showAllUsers();
                            break;
                        case "show_banned_users":
                            await this.userMessages.showBannedUsers();
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                            break
                    }
                    break;
                case "userManagementIn":
                    switch (this.data) {
                        case "back":
                            await this.back("userManagement");
                            break;
                        default:
                            await this.basicMessages.unknownCommand();
                            break
                    }
                    break;
                case "confirmBan":
                    switch (this.data) {
                        case "no":
                        case "back":
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
                    switch (this.data) {
                        case "no":
                        case "back":
                            await this.back("userManagement");
                            break;
                        case "yes":
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
        switch (this.data) {
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
        }
        else if (to == "settings") {
            this.talker = await TalkerController.talk({
                user_id: this.user!.id,
                pre_request: this.talker?.request,
                request: "settings",
                waiting: true,
            }) ?? undefined;
            await this.basicMessages.settings();
        }
        else if (to == "userManagement") {
            await this.userMessages.menu();
        }
        else {
            throw new Error("Unknown back to command");
        }
    }
}