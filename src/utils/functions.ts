import {TgCurrency} from "../types/invoice";

const pluralOrSingular = (word: string, length: number,ctx:any) => {
    word = word.toLowerCase().trim();
    if (length > 1) {
        return ctx.i18n.t(word+"MakeMore");
    } else {
        return ctx.i18n.t(word+"MakeLess");
    }
};

const addMonth = (date:Date, months:number) =>{
    const d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    return date;
}

const isNumber = (value: any) => {
    try {
        const number = parseInt(value);
        return !isNaN(number);
    }catch (e) {
        return false;
    }
}

const leftDays = (endDate: Date,noZero = false) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date();
    const leftDay = Math.round(Math.abs((endDate.getTime() - firstDate.getTime()) / oneDay));
    if (noZero && leftDay == 0) {
        return 1;
    }else {
        return leftDay;
    }
}

const stringify = (value: any): string | null => {
    return value === null || value === undefined || value.toString().trim() === "" ? null : value.toString();
}

const getCurrency = async (currency: string): Promise<TgCurrency | null> => {
    const url = 'https://core.telegram.org/bots/payments/currencies.json';
    const json = await fetch(url).then(res => res.json());
    if(json.hasOwnProperty(currency)){
        return json[currency];
    }else {
        return null;
    }
}
const convertToBoolean = (value: any):boolean => {
    if (value === null || value === undefined || value === "") {
        return false;
    }
    return value === "true" || value === true || value === 1 || value === "1" || value === "on" || value === "yes" || value === "y";
}

export {pluralOrSingular,addMonth,isNumber,stringify,leftDays,getCurrency,convertToBoolean}