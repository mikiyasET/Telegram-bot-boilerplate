export type sendInvoice = {
    title: string;
    img?: string;
    description: string;
    products: invoiceProduct[];
    tips?: number[];
    currency: string;
    payload: string;
};

type invoiceProduct = {
    name: string;
    price: number;
}

export type TgCurrency = {
    code: string
    title: string,
    "symbol": string,
    "native": string,
    "thousands_sep": string,
    "decimal_sep": string,
    "symbol_left": boolean,
    "space_between": symbol,
    "exp": number,
    "min_amount": string,
    "max_amount": string
}