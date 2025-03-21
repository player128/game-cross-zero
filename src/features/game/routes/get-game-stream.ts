import { getGameById } from "@/entities/game/server";
import { GameId } from "@/kernel/ids";
import { sseSTream } from "@/shared/lib/sse/server";
import { NextRequest } from "next/server";
import { gameEvents } from "../service/game-events";

export async function getGameStream(
    req: NextRequest,
    { params }: { params: Promise<{ id: GameId }> }
) {
    const { id } = await params;
    const game = await getGameById(id);

    if (!game) {
        return  new Response(`Game not found`, {
            status: 404,
        });
    }

    const { response, write, addCloseListener } = sseSTream(req);

    write(game);

    addCloseListener(
        await gameEvents.addListener(game.id, (event) => {
            write(event.data);
        }),
    );

    return response;
}