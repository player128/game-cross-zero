import { GameDomain } from "@/entities/game";

export function GameStatus({ game }: {
    game: GameDomain.GameEntity
}) {
    switch (game.status) {
        case "idle":
            return <div className="text-lg">Oжидание игрока</div>;
        case "inProgress":{
            const currentSybmbol = GameDomain.getGameCurrenSymbol(game);
            // const nextSymbol = GameDomain.getGameNextSymbol(currentSybmbol);
            return (<div className="text-lg">
                Ход : {currentSybmbol}
            </div>);
        }
        case "gameOver": {
            const currentSybmbol = GameDomain.getGameCurrenSymbol(game);
            return <div className="text-lg">Победитель: {currentSybmbol}</div>;
        }
        case "gameOverDraw":
            return <div className="text-lg">Ничья</div>;
    }
}