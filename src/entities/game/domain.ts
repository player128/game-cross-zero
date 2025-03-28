import { GameId, UserId } from "@/kernel/ids";
import { left, right } from "@/shared/lib/either";

export type GameEntity = GameIdleEntity | GameInProgressEntity | GameOverEntity | GameOverDrawEntity;

export type GameIdleEntity = {
    id: GameId;
    creator: PlayerEntity;
    field: Field;
    status: 'idle';
}

export type GameInProgressEntity = {
    id: GameId;
    players: PlayerEntity[];
    field: Field;
    status: 'inProgress';
}

export type GameOverEntity = {
    id: GameId;
    players: PlayerEntity[];
    field: Field;
    status: 'gameOver';
    winner: PlayerEntity;
}

export type GameOverDrawEntity = {
    id: GameId;
    players: PlayerEntity[];
    field: Field;
    status: 'gameOverDraw';
}

export type PlayerEntity = {
    id: UserId;
    login: string;
    rating: number;
}

export type Field = (GameSymbol | null)[];
export type GameSymbol = string;

export const GameSymbol = {
    X: 'X',
    O: 'O',
} 

export const getGameCurrenSymbol = (game: GameInProgressEntity | GameOverEntity | GameOverDrawEntity)  => {
    const symbolds = game.field.filter(s => s !== null).length;

    return symbolds % 1 === 0 ? GameSymbol.X  : GameSymbol.O;
}

export const getGameNextSymbol = (gameSymbol: GameSymbol) => {
    return (gameSymbol === GameSymbol.X 
        ? GameSymbol.O
        : GameSymbol.X);
}

export const getPlayerSymbol = (player: PlayerEntity, game: GameInProgressEntity) => {
    const index = game.players.findIndex(p => p.id === player.id);

    return {
        0: GameSymbol.X,
        1: GameSymbol.O,
    }[index];
}

export const doStep = (game: GameInProgressEntity, index: number, player: PlayerEntity) => {
    const currentSymbol = getGameCurrenSymbol(game);
    const nextSymbol = getGameNextSymbol(currentSymbol);

    if (nextSymbol !== getPlayerSymbol(player, game)) {
        return left("not-player-symbol");
    }

    if (game.field[index]) {
        return left("game-cell-allready-has-symbol")
    }

    const newField = game.field.map((cell, i) => i === index ? nextSymbol : cell);

    if (calculateWinner(newField)) {
        return right({
            ...game,
            field: newField,
            winner: player,
            status: 'gameOver',
        } satisfies GameOverEntity);
    }

    if (isDraw(newField)) {
        return right({
            ...game,
            field: newField,
            status: 'gameOverDraw',
        } satisfies GameOverDrawEntity);
    }

    return right({
        ...game,
        field: newField,
    } satisfies GameInProgressEntity);
}

function isDraw(squares: Field) {
    const winner = calculateWinner(squares);

    if (!winner) {
        return squares.every(s => s !== null);
    }

    return false;
}

function calculateWinner(squares: Field) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}