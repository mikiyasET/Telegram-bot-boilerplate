import express, {NextFunction, Request, Response} from "express";
import {bot} from "../client";
const WebhooksRoute = express.Router();

WebhooksRoute.get('/set',async (req: Request, res: Response,next:NextFunction) => {
    try {
        if (process.env.WEBHOOK_URL === undefined)
            throw new Error('WEBHOOK_URL is not defined!');
        if (await bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/webhook`)) {
            res.send('Webhook was set successfully!');
        } else {
            res.send('Webhook not set!');
        }
    }catch (e) {
        next(e)
    }
});

export {WebhooksRoute}