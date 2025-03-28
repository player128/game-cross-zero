import { GameDomain } from "@/entities/game";
import { GameId } from "@/kernel/ids";
import { routes } from "@/kernel/routes";
import { useEventsSource } from "@/shared/lib/sse/client";
import { useTransition } from 'react';
import { gameStepAction } from "../actions/game-step";

export function useGame(gameId: GameId) {
    const {dataStream, isPending} = useEventsSource<GameDomain.GameEntity>(
        routes.gameStream(gameId)
    );

    const [isPendingTransition, startTransition] = useTransition();

    const step = (index: number) => {
        startTransition(async () => {
           await gameStepAction({index, gameId});
        })
    }

    return {
        game: dataStream,
        step,
        isPending: isPending,
        isStepPending: isPendingTransition,
    }
}