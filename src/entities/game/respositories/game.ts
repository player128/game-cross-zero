import { prisma } from "@/shared/lib/db";
import { GameEntity, GameIdleEntity, GameInProgressEntity, GameOverDrawEntity, GameOverEntity, PlayerEntity } from '../domain';
import { Game, User, Prisma, GamePlayer } from "@prisma/client";
import { z } from "zod";
import { GameId } from "@/kernel/ids";

const gameInclude = {
    winner: { include:{ user: true } },
    players: { include:{ user: true } },
};

async function gamesList(where?: Prisma.GameWhereInput): Promise<GameEntity[]> {
    const games = await prisma.game.findMany({
        where,
        include: gameInclude,
    });

    return games.map(dbGameToGameEntity);
}

async function startGame(gameId: GameId, player: PlayerEntity) {
    const game = await prisma.game.update({
        where: {id: gameId},
        data: {
            players: {
                create: {
                    index: 1,
                    userId: player.id,
                }
            },
            status: "inProgress",
        },
        include: gameInclude,
    });

    return dbGameToGameEntity(game);
}

async function saveGame(
    game: GameInProgressEntity | GameOverDrawEntity | GameOverEntity
) {
    const winnerId = 
        game.status === 'gameOver' 
            ? await prisma.gamePlayer
                .findFirstOrThrow({
                    where: { userId: game.winner.id }
                })
                .then(p => p.id)
            : undefined;    

    return dbGameToGameEntity(await prisma.game.update({
            where: {id: game.id},
            data: {
                field: game.field,
                status: game.status,
                winnerId:  winnerId,
            },
            include: gameInclude,
        })
    );
}

async function getGame(where?: Prisma.GameWhereInput) {
    const game = await prisma.game.findFirst({
        where,
        include: gameInclude,
    });

    if (game) {
        return dbGameToGameEntity(game);
    }

    return undefined;
}

async function createGame(game: GameIdleEntity): Promise<GameEntity> {
    const createdGame = await prisma.game.create({
        data:{
            status: game.status,
            id: game.id,
            field: game.field,
            players: {
                create:{
                    index: 0,
                    userId: game.creator.id,
                },
            },
        },
        include: gameInclude,
    })

    return dbGameToGameEntity(createdGame);
}

const fieldSchema = z.array(z.union([z.string(), z.null()]));

function dbGameToGameEntity(
    game:  Game & { 
        players: Array<GamePlayer & {user: User}>;
        winner?: GamePlayer & {user: User} | null;
    },
): GameEntity {
    const players = game.players.sort((a, b) => a.index - b.index).map(dbPlayerToPlayer);
    switch (game.status) {
        case 'idle': {
            const [creator] = players;
            if (!creator)throw new Error("creator should be in game idle!");

            return {
                id: game.id,
                creator: creator,
                field: fieldSchema.parse(game.field),
                status: game.status,
            } satisfies GameIdleEntity;
        }

        case 'inProgress' :
        case 'gameOverDraw': {
            return {
                id: game.id,
                players: players,
                field: fieldSchema.parse(game.field),
                status: game.status,
            };
        }

        case 'gameOver': {
            if (!game.winner)throw new Error("winner should be in game over!");
        
            return {
                id: game.id,
                players: players,
                field: fieldSchema.parse(game.field),
                status: game.status,
                winner: dbPlayerToPlayer(game.winner),
            } satisfies GameOverEntity;
        }
    }   
}

export const dbPlayerToPlayer = (db:GamePlayer & {user: User}): PlayerEntity => {
    return {
        id: db.user.id,
        login: db.user.login,
        rating: db.user.rating,
    };
}

export const gameRepository = { gamesList, createGame, getGame, startGame, saveGame };