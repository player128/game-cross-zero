import { GameId } from "@/kernel/ids";
import { GameClient } from "./game-client";
import { getCurrentUser } from "@/entities/user/server";
import { getGameById, startGame } from "@/entities/game/server";
import { gameEvents } from "../service/game-events";
import { redirect } from "next/navigation";

export async function Game({ gameId }: {gameId: GameId}) {

    let game = await getGameById(gameId);

    if (!game) {
        redirect('/');
    }

    const user = await getCurrentUser();

    if (user) {
       const startGameResult = await startGame(gameId, user);

       if (startGameResult.type === 'right') {
           game = startGameResult.value;
           gameEvents.emit(startGameResult.value); 
       }
    }

    return (
        <GameClient defaultGame={game} />
    );
}