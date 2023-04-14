import {Prisma,admin} from "@prisma/client";
import prisma from "../client";

class AdminController {

    static async create(data: Prisma.adminUncheckedCreateInput): Promise<admin> {
        return prisma.admin.create({
            data: data,
        });
    }
    static async update(id: string,data: Prisma.adminUncheckedUpdateInput): Promise<admin> {
        return prisma.admin.update({
            where: {
                id: id,
            },
            data: data,
        });
    }
    static async delete(id: string): Promise<admin> {
        return prisma.admin.delete({
            where: {
                id: id,
            },
        });
    }
    static async get(id: string): Promise<admin | null> {
        const data: Prisma.adminWhereInput | null = await prisma.admin.findUnique({
            where: {
                id: id,
            },
        });
        if (data != null)
            delete data.password;
        return data as admin;
    }
    static async getAll(): Promise<admin[]> {
        let data: Prisma.adminWhereInput[] | null = await prisma.admin.findMany();
        if (data != null)
            data.forEach((d) => {
                delete d.password;
            });
        return data as admin[];
    }
    static async getByUserId(id: string): Promise<admin | null> {
        const data: Prisma.adminWhereInput | null = await prisma.admin.findUnique({
            where: {
                user_id: id
            }
        });
        if (data != null)
            delete data.password
        return data as admin;
    }
}

export {AdminController}