import {Prisma, user} from "@prisma/client";
import prisma from "../client";

class UserController {

    static async create(data: Prisma.userUncheckedCreateInput): Promise<user> {
        return prisma.user.create({
            data: data,
        });
    }

    static async update(id: string, data: Prisma.userUncheckedUpdateInput): Promise<user> {
        return prisma.user.update({
            where: {
                id: id,
            },
            data: data,
        });
    }

    static async delete(id: string): Promise<user> {
        return prisma.user.delete({
            where: {
                id: id,
            },
        });
    }

    static async get(id: string): Promise<user | null> {
        let data: Prisma.userCreateInput | null = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (data != null)
            delete data.password;
        return data as user;
    }

    static async getAll(): Promise<user[]> {
        let data: Prisma.userCreateInput[] | null = await prisma.user.findMany();
        if (data != null)
            data.forEach((d) => {
                delete d.password;
            });
        return data as user[];
    }

    static async getBanned(): Promise<user[]> {
        return prisma.user.findMany({
            where: {
                status: false,
            }
        });
    }

    static async ban(id: string,date?:Date): Promise<user> {
        return prisma.user.update({
            where: {
                id: id,
            },
            data: {
                status: false,
                banUntil: date ?? null,
            }
        });
    }
    static async unban(id: string): Promise<user> {
        return prisma.user.update({
            where: {
                id: id,
            },
            data: {
                status: true,
                banUntil: null,
            }
        });
    }

    static async getUsers(): Promise<user[]> {
        return prisma.user.findMany({
            where: {
                status: true,
            }
        });
    }

    static async getByTelegramId(id: string): Promise<user | null> {
        return prisma.user.findUnique({
            where: {
                tg_id: id,
            },
        });
    }

    static async checkValidity(id: string): Promise<user | null> {
        return prisma.user.findFirst({
            where: {
                id: id,
                status: true,
            }
        })
    }
    static async getLimited(): Promise<user[]> {
        return prisma.user.findMany({
            where: {
                status: false,
                banUntil: {
                    lte: new Date()
                }
            }
        });
    }
}

export {UserController}