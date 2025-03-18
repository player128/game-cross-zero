import cuid from "cuid";
import { PlayerEntity } from "../domain";
import { gameRepository } from '../respositories/game';
import { left, right } from "@/shared/lib/either";
import { GameId } from "@/kernel/ids";

export const getGameById = async (gameId: GameId) => {
    return await gameRepository.getGame({id: gameId});
}