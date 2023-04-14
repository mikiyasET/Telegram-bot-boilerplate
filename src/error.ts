import  {NextFunction,Request,Response} from "express";


export function errorMiddleWare(error: errorRes, req: Request, res: Response, next: NextFunction): any {
    if(!(error instanceof EatError)){
        return res.status(400).send(error);
    }
    return res.status(error.statusCode ?? 400).send(error);
}


export interface errorRes {
    msg: any
    type: string
    statusCode: number
}

export type EatErrorType = 'success' | 'error' | 'warning' | 'info' | 'question';
export class EatError implements errorRes {
    constructor({message, response, type, status, code}: { message: any, response: any, type: EatErrorType, status?:number, code?:string}) {
        this.statusCode = status ?? response.status;
        this.type = type;
        this.name = "EatError";
        this.msg = message;
        this.code = code ?? 'unknown';
    }

    msg: any;

    type: string
    statusCode: number
    code: string
    name: string;
}