import { userRepository } from "../repositories/user";
import { sessionServise } from "./sessions";

export const getCurrentUser = async () => {
    const { session } = await sessionServise.verifySession()
    return userRepository.getUser({
        id: session.id,
    });
};