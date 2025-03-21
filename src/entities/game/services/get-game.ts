import { gameRepository } from '../respositories/game';
import { GameId } from "@/kernel/ids";

export const getGameById = async (gameId: GameId) => {
    return await gameRepository.getGame({id: gameId});
}