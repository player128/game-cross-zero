import { prisma } from "@/shared/lib/db";
import { UserEntity } from "../domain";
import { Prisma } from "@prisma/client";


export async function saveUser(user: UserEntity): Promise<UserEntity> {
    return prisma.user.upsert({
        where: {
            id: user.id,
        },
        create: user,
        update: user,
    });
}

export async function getUser(where: Prisma.UserWhereInput): Promise<UserEntity | null> {
    return prisma.user.findFirst({
        where,
    });
}
export const userRepository = { saveUser, getUser };