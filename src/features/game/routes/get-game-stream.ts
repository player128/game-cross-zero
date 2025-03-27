import { getGameById, surrenderGame } from "@/entities/game/server";
import { GameId } from "@/kernel/ids";
import { sseSTream } from "@/shared/lib/sse/server";
import { NextRequest } from "next/server";
import { gameEvents } from "../service/game-events";
import { getCurrentUser } from "@/entities/user/server";

export async function getGameStream(
    req: NextRequest,
    { params }: { params: Promise<{ id: GameId }> }
) {
    const { id } = await params;
    const  user  = await getCurrentUser();

    const game = await getGameById(id);

    if (!game || !user) {
        return  new Response(`Game not found`, {
            status: 404,
        });
    }

    const { response, write, addCloseListener } = sseSTream(req);

    write(game);

    const unwatch = await gameEvents.addListener(game.id, (event) => {
        write(event.data);
    });

    addCloseListener( async () => {
        unwatch();

        const result = await surrenderGame(id, user)

        if (result.type === 'right') {
            gameEvents.emit(result.value);
        }
    });

    return response;
}