import { left, right } from "@/shared/lib/either";
import { userRepository } from "../repositories/user";
import { passwordService } from "./password";

export async function verifyUserPassword({login, password}: {login: string, password: string}) {
    const user = await userRepository.getUser({
        login,
    });

    if (!user) {
        return left('wrong-login-or-password' as const);
    }

    const isCompare = await passwordService.comparePassword({
        password,
        hash: user.passwordHash,
        salt: user.salt,
    });

    if (!isCompare) {
        return left('wrong-login-or-password' as const);
    }

    return right(user);
}