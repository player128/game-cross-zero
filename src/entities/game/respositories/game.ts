import { prisma } from "@/shared/lib/db";
import { GameEntity, GameIdleEntity, GameOverEntity, PlayerEntity } from '../domain';
import { Game, User, Prisma } from "@prisma/client";
import { z } from "zod";
import { removePassword } from "@/shared/lib/password";
import { GameId } from "@/kernel/ids";

async function gamesList(where?: Prisma.GameWhereInput): Promise<GameEntity[]> {
    const games = await prisma.game.findMany({
        where,
        include: {
            winner: true,
            players: true,
        }
    })

    return games.map(dbGameToGameEntity);
}

async function startGame(gameId: GameId, player: PlayerEntity) {
    const game = await prisma.game.update({
        where: {id: gameId},
        data: {
            players: {
                connect: {
                    id: player.id,
                }
            },
            status: "inProgress",
        },
        include: {
            winner: true,
            players: true,
        }
    });

    return dbGameToGameEntity(game);
}

async function getGame(where?: Prisma.GameWhereInput) {
    const game = await prisma.game.findFirst({
        where,
        include: {
            winner: true,
            players: true,
        }
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
                connect:{
                    id: game.creator.id,
                },
            },
        },
        include: {
            players: true,
            winner:true,
        }
    })

    return dbGameToGameEntity(createdGame);
}

const fieldSchema = z.array(z.union([z.string(), z.null()]));

function dbGameToGameEntity(
    game:  Game & { 
        players: User[];
        winner?: User | null;
    },
): GameEntity {
    const players = game.players.map(removePassword);
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
                winner: removePassword(game.winner),
            } satisfies GameOverEntity;
        }
    }
    
}

export const gameRepository = { gamesList, createGame, getGame, startGame };