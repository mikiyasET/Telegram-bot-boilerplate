import {Prisma,talker} from "@prisma/client";
import prisma from "../client";

class TalkerController {

    static async create(data: Prisma.talkerUncheckedCreateInput): Promise<talker> {
        return prisma.talker.create({
            data: data,
        });
    }
    static async update(id: string,data: Prisma.talkerUncheckedUpdateInput): Promise<talker> {
        return prisma.talker.update({
            where: {
                id: id,
            },
            data: data,
        });
    }
    static async delete(id: string): Promise<talker> {
        return prisma.talker.delete({
            where: {
                id: id,
            },
        });
    }
    static async get(id: string): Promise<talker | null> {
        return prisma.talker.findUnique({
            where: {
                id: id,
            },
        });
    }
    static async getAll(): Promise<talker[]> {
        return prisma.talker.findMany();
    }

    static async getByUserId(id: string): Promise<talker | null> {
        return prisma.talker.findUnique({
            where: {
                user_id: id,
            },
        });
    }
    static async check(id: string): Promise<boolean> {
        let data: talker | null = await prisma.talker.findUnique({
            where: {
                id: id,
            },
        });
        return data !== null;
    }
    static async talk(talk:Prisma.talkerUncheckedCreateInput): Promise<talker | null> {
        let data: talker | null = await prisma.talker.findUnique({
            where: {
                user_id: talk.user_id,
            },
        });
        if (data !== null) {
            data.waiting = talk.waiting ?? true;
            return prisma.talker.update({
                where: {
                    user_id: talk.user_id,
                },
                data: talk,
            });
        }else {
            return await this.create({
                user_id: talk.user_id,
                pre_request: "init",
                request: "menu",
                waiting: true,
            });
        }
    }
}

export {TalkerController}