import { GameIdleEntity } from "../domain";
import { gameRepository } from "../respositories/game";

export async function getIdleGames(): Promise<GameIdleEntity[]>  {
    const games = await gameRepository.gamesList({
        status: 'idle',
    });

    return games as GameIdleEntity[];
}