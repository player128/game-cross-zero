import { GameId } from "@/kernel/ids";
import { GameLayout } from "../ui/layout";
import { GamePlayers } from "../ui/players";
import { GameDomain } from "@/entities/game";
import { GameStatus } from "../ui/status";
import { GameField } from "../ui/field";

export function Game({ gameId }: {gameId: GameId}) {
    const game: GameDomain.GameEntity = {
        id: '1',
        players: [
            {
                id: '1',
                login: 'User',
                rating: 1000,
            },
            {
                id: '2',
                login: 'User2',
                rating: 800,
            },
        ],
        status: 'gameOver',
        field: [null, null, null, '0', 'X', null, null, null, null],
    }

    return (<GameLayout 
        players={<GamePlayers game={game}/>}
        status={<GameStatus game={game}/>}
        field={<GameField game={game}/>}
    />);
}