import { GameDomain } from "@/entities/game";
import { GameId } from "@/kernel/ids";
import { useEventsSource } from "@/shared/lib/sse/client";

export function useGame(gameId: GameId) {
    const {dataStream, isPending} = useEventsSource<GameDomain.GameEntity>(`/game/${gameId}/stream`);

    return {
        game: dataStream,
        isPending,
    }
}