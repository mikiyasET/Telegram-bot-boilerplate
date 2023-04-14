import { PrismaClient } from '@prisma/client'
import {Telegraf} from "telegraf";

if (process.env.BOT_TOKEN == undefined)
    throw new Error("BOT_TOKEN is not defined");

let prisma = new PrismaClient();
const bot = new Telegraf(process.env.BOT_TOKEN);


export {bot}
export default prisma