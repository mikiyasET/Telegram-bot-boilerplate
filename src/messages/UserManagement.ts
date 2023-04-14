import {UserController} from "../controllers/UserController";
import {talker, user} from "@prisma/client";
import {convertToBoolean, leftDays, pluralOrSingular, stringify} from "../utils/functions";
import {Basic} from "./Basic";
import {BasicIKYB} from "../keyboards/inline/Basic";
import {TalkerController} from "../controllers/BotTalkers";

export class UserManagement {
    private ctx: any;
    private basic: Basic;

    constructor(ctx: any) {
        this.ctx = ctx;
        this.basic = new Basic(this.ctx);
    }

    async init() {
        await this.basic.init();
    }

    async menu() {
        this.basic.talker = await TalkerController.talk({
            user_id: this.basic.user!.id,
            pre_request: this.basic.talker?.request,
            request: "userManagement",
            waiting: true,
        }) ?? undefined;
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.basic.isCallback) {
                await this.ctx.editMessageText(this.ctx.i18n.t('userManagementMSG'), this.basic.basicIKYB.management());
                return;
            }
        } else {
            await this.ctx.reply(this.ctx.i18n.t('userManagementMSG'), this.basic.basicKYB.back());
            return;
        }
        await this.basic.unknownCommand();
    }

    async stats() {
        const users = await UserController.getAll();
        const usersCount = users.length;
        const msg = `<b><u>Statistics</u></b>\n\n<b>Bot Users:</b> ${usersCount}`;
        await this.ctx.replyWithHTML(msg);
    }

    async showAllUsers() {
        const users: user[] = await UserController.getAll();
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.basic.isCallback) {
                if (users.length > 0) {
                    this.basic.talker = await TalkerController.talk({
                        user_id: this.basic.user!.id,
                        pre_request: this.basic.talker?.request,
                        request: "userManagementIn",
                        waiting: true,
                    }) ?? undefined;
                    let message = `<u>${this.ctx.i18n.t('usersMSG')}</u> \n\n`;
                    let count = 1;
                    users.forEach((u) => {
                        message += `<b>${count}.</b> <i>${u.first_name} ${u.last_name ?? ""}</i> | <code>${u.id}</code>\n`;
                        count++;
                    });
                    await this.ctx.editMessageText(message, this.basic.basicIKYB.back());
                    return;
                } else {
                    await this.ctx.answerCbQuery(this.ctx.i18n.t('noUsersMSG'), {show_alert: true});
                    return;
                }
            }
        } else {
            if (users.length == 0) {
                const message = `<b><u>Users</u></b>\n\n<i>No users found</i>`;
                await this.ctx.replyWithHTML(message);
            } else {
                let message = `<u>${this.ctx.i18n.t('usersMSG')}</u> \n\n`;
                let count = 1;
                users.forEach((u) => {
                    message += `<b>${count}.</b> <i>${u.first_name} ${u.last_name}</i> | <code>${u.id}</code>\n`;
                    count++;
                });
                await this.ctx.replyWithHTML(message);
            }
            return;
        }
        await this.basic.unknownCommand();
    }

    async showBannedUsers() {
        const users: user[] = await UserController.getBanned();
        if (convertToBoolean(process.env.IS_INLINE)) {
            if (this.basic.isCallback) {
                if (users.length > 0) {
                    this.basic.talker = await TalkerController.talk({
                        user_id: this.basic.user!.id,
                        pre_request: this.basic.talker?.request,
                        request: "userManagementIn",
                        waiting: true,
                    }) ?? undefined;
                    let message = `<u>${this.ctx.i18n.t('bannedUsersMSG')}</u> \n\n`;
                    let count = 1;
                    users.forEach((u) => {
                        message += `<b>${count}.</b> <i>${u.first_name} ${u.last_name ?? ""}</i> | <code>${u.id}</code>\n`;
                        count++;
                    });
                    await this.ctx.editMessageText(message, this.basic.basicIKYB.back());
                    return;
                } else {
                    await this.ctx.answerCbQuery(this.ctx.i18n.t('noBannedUsersMSG'), {show_alert: true});
                    return;
                }
            }
        } else {
            if (users.length == 0) {
                const message = `<b><u>${this.ctx.i18n.t('bannedUsersMSG')}</u></b>\n\n<i>${this.ctx.i18n.t('noBannedUsersMSG')}</i>`;
                await this.ctx.replyWithHTML(message);
            } else {
                let message = `<u>${this.ctx.i18n.t('bannedUsersMSG')}</u> \n\n`;
                let count = 1;
                users.forEach((u) => {
                    message += `<b>${count}.</b> <i>${u.first_name} ${u.last_name}</i> | <code>${u.id}</code>\n`;
                    count++;
                });
                await this.ctx.replyWithHTML(message);
            }
            return;
        }
        await this.basic.unknownCommand();

    }

    async ban() {
        const value = this.ctx.session.selected.split(":");
        if (value.length == 2) {
            const user = await UserController.get(value[0]);
            const days = value[1] != "unlimited" ? parseInt(value[1]) : null;
            if (user != null) {
                let end_date = new Date();
                if (days != null)
                    end_date.setDate(end_date.getDate() + days);
                const u: user = await UserController.ban(user.id, days == null ? undefined : end_date);
                if (u != null) {
                    if (convertToBoolean(process.env.IS_INLINE)) {
                        if (this.basic.isCallback) {
                            await this.ctx.editMessageText(this.ctx.i18n.t("banSuccessMSG", {
                                name: user.first_name ?? "User",
                                day: days == null ? "Forever" : days + " " + pluralOrSingular("day", days, this.ctx)
                            }), this.basic.basicIKYB.back());
                        } else {
                            await this.basic.unknownCommand();
                        }
                    } else {
                        await this.ctx.replyWithHTML(this.ctx.i18n.t("banSuccessMSG", {
                            name: user.first_name ?? "User",
                            day: days == null ? "Forever" : days + " " + pluralOrSingular("day", days, this.ctx)
                        }));
                    }
                    await this.ctx.i18n.locale(user.language ?? 'en')
                    await this.ctx.telegram.sendMessage(user.tg_id, this.ctx.i18n.t('bannedUserMSG', {
                        name: user.first_name ?? "User",
                        day: days == null ? "Forever" : (days + " " + pluralOrSingular("day", days, this.ctx))
                    }));
                    await this.ctx.i18n.locale(this.basic.user?.language ?? 'en')
                } else {
                    if (convertToBoolean(process.env.IS_INLINE)) {
                        if (this.basic.isCallback) {
                            await this.ctx.editMessageText(this.ctx.i18n.t("banFailed", {
                                name: user.first_name ?? "User"
                            }), this.basic.basicIKYB.back());
                        } else {
                            await this.basic.unknownCommand();
                        }
                    } else {
                        await this.ctx.replyWithHTML(this.ctx.i18n.t("banFailed", {
                            name: user.first_name ?? "User"
                        }));
                    }
                }
            } else {
                await this.basic.invalidInput();
            }
        } else {
            await this.basic.invalidInput();
        }
    }

    async unban() {
        const value = this.ctx.session.selected;
        if (stringify(value) != null) {
            const user = await UserController.get(value);
            if (user != null) {
                if (await UserController.unban(user.id)) {
                    if (convertToBoolean(process.env.IS_INLINE)) {
                        if (this.basic.isCallback) {
                            await this.ctx.editMessageText(this.ctx.i18n.t("unbannedMSG", {
                                name: user.first_name ?? "User",
                            }), this.basic.basicIKYB.back());
                        } else {
                            await this.basic.unknownCommand();
                        }
                    } else {
                        await this.ctx.reply(this.ctx.i18n.t("unbannedMSG", {
                            name: user.first_name ?? "User",
                        }));
                    }
                    await this.ctx.i18n.locale(user.language ?? 'en');
                    await this.ctx.telegram.sendMessage(user.tg_id, this.ctx.i18n.t('unbannedUserMSG', {
                        name: user.first_name ?? "User",
                    }));
                    await this.ctx.i18n.locale(this.basic.user?.language ?? 'en');
                } else {
                    if (convertToBoolean(process.env.IS_INLINE)) {
                        if (this.basic.isCallback) {
                            await this.ctx.editMessageText(this.ctx.i18n.t("notBannedMSG"), this.basic.basicIKYB.back());
                        } else {
                            await this.basic.unknownCommand();
                        }
                    } else {
                        await this.ctx.reply(this.ctx.i18n.t("notBannedMSG"));
                    }
                }
            } else {
                await this.basic.invalidInput();
            }
        } else {
            await this.basic.userNotFound();
        }
    }

}