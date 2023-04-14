export class BasicKYB {
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
        };
        this.skipObj = {
            text: this.ctx.i18n.t("skipBTN"),
        };
        this.cancelObj = {
            text: this.ctx.i18n.t("cancelBTN"),
        };
        this.backCancelObj = [
            {
                text: this.ctx.i18n.t("backBTN"),
            },
            {
                text: this.ctx.i18n.t("cancelBTN"),
            }
        ];
        this.cancelEditObj = [
            {
                text: this.ctx.i18n.t("sameBTN"),
            },
            {
                text: this.ctx.i18n.t("cancelBTN"),
            }
        ];
    }
    back = () => {
        return {
            reply_markup: {
                keyboard: [
                    [this.backObj]
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        };
    }
    list = (list:any) => {
        return {
            reply_markup: {
                keyboard: [
                    ...list,
                    this.backObj
                ],
                resize_keyboard: true,
            },
            parse_mode: "HTML"
        };
    }
    cancel = () => {
        return {
            reply_markup: {
                keyboard: [
                    [this.cancelObj]
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    confirm = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: this.ctx.i18n.t("confirmBTN")}, this.cancelObj]
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    userMenu = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: this.ctx.i18n.t("accountBTN")}],
                    [{text: this.ctx.i18n.t("settingsBTN")}],
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    adminMenu = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: this.ctx.i18n.t("accountBTN")},{text: this.ctx.i18n.t("userManagementBTN")}],
                    [{text: this.ctx.i18n.t("settingsBTN")}],
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    cancelEdit = () => {
        return {
            reply_markup: {
                keyboard: [
                    this.cancelEditObj
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    skipCancel = () => {
        return {
            reply_markup: {
                keyboard: [
                    [this.skipObj],
                    [this.cancelObj]
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    positioning = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: this.ctx.i18n.t("firstBTN")}, {text: this.ctx.i18n.t("lastBTN")}],
                    [{text: this.ctx.i18n.t("sameBTN")}],
                    [this.cancelObj]
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    settings = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: this.ctx.i18n.t("languageBTN")}],
                    [this.backObj]
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    language = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: "🇬🇧 English"}, {text: "🇪🇹 አማርኛ"}],
                    [this.backObj]
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    yesNo = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: this.ctx.i18n.t("yesBTN")}, {text: this.ctx.i18n.t("noBTN")}],
                ],
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
}