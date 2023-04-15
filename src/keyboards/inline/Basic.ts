export class BasicIKYB {
    private ctx: any;
    private readonly backObj: any;
    private readonly skipObj: any;
    private readonly cancelObj: any;
    private readonly backCancelObj: any;
    private readonly cancelEditObj: any;
    constructor(ctx:any) {
        this.ctx = ctx;
        this.backObj = {
            text: this.ctx.i18n.t("backBTN"),
            callback_data: "back"
        }
        this.skipObj = {
            text: this.ctx.i18n.t("skipBTN"),
            callback_data: "skip"
        }
        this.cancelObj = {
            text: this.ctx.i18n.t("cancelBTN"),
            callback_data: "cancel"
        }
        this.backCancelObj = [{
            text: this.ctx.i18n.t("backBTN"),
            callback_data: "back"
        }, {
            text: this.ctx.i18n.t("cancelBTN"),
            callback_data: "cancel"
        }]
        this.cancelEditObj = [
            {
                text: this.ctx.i18n.t("sameBTN"),
                callback_data: "same"
            },
            {
            text: this.ctx.i18n.t("cancelBTN"),
            callback_data: "cancel"
        }]
    }
    management = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{ text: this.ctx.i18n.t("usersBTN"), callback_data: "show_all_users"},{ text: this.ctx.i18n.t("bannedUsersBTN"), callback_data: "show_banned_users"}],
                    [{ text: this.ctx.i18n.t("statusBTN"), callback_data: "show_status"}],
                    [this.backObj]
                ]
            },
            parse_mode: "HTML"
        };
    }
    back = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [this.backObj]
                ]
            },
            parse_mode: "HTML"
        };
    }
    yesNo = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{text: this.ctx.i18n.t("yesBTN"), callback_data: "yes"}, {text: this.ctx.i18n.t("noBTN"), callback_data: "no"}],
                ],
            },
            parse_mode: "HTML"
        }
    }
    cancel = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [this.cancelObj]
                ]
            },
            parse_mode: "HTML"
        };
    }
    confirm = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{text: this.ctx.i18n.t("confirmBTN"), callback_data: "confirm"}, this.cancelObj]
                ],
            },
            parse_mode: "HTML"
        }
    }
    language = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{text: "🇬🇧 English", callback_data: "lang_en"}, {text: "🇪🇹 አማርኛ", callback_data: "lang_am"}],
                    [{text: this.ctx.i18n.t("backBTN"), callback_data: "back"}]
                ],
            },
            parse_mode: "HTML"
        }
    }
    userMenu = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{text: this.ctx.i18n.t("accountBTN"), callback_data: "account"}],
                    [{text: this.ctx.i18n.t("settingsBTN"), callback_data: "settings"}],
                ],
            },
            parse_mode: "HTML"
        }
    }
    settings = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{text: this.ctx.i18n.t("languageBTN"), callback_data: "language"}],
                    [{text: this.ctx.i18n.t("backBTN"), callback_data: "back"}]
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    adminMenu = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{text: this.ctx.i18n.t("accountBTN"), callback_data: "account"},{text: this.ctx.i18n.t("userManagementBTN"), callback_data: "userManagement"}],
                    [{text: this.ctx.i18n.t("settingsBTN"), callback_data: "settings"}],
                ],
            },
            parse_mode: "HTML"
        }
    }
    skipCancel = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [this.skipObj],
                    [this.cancelObj]
                ],
            },
            parse_mode: "HTML"
        }
    }
    positioning = () => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{text: this.ctx.i18n.t("firstBTN"), callback_data: "pos_first"}, {text: this.ctx.i18n.t("lastBTN"), callback_data: "pos_first"}],
                    [{text: this.ctx.i18n.t("sameBTN"), callback_data: "same"}],
                    [this.cancelObj]
                ],
            },
            parse_mode: "HTML"
        }
    }
    list = (list:any) => {
        return {
            reply_markup: {
                inline_keyboard: [
                    ...list
                ]
            },
            parse_mode: "HTML"
        };
    }
}