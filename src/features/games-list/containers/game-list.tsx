import { getIdleGames } from "@/entities/game/server";
import { Layout } from "../ui/layout";
import { GameCard } from "../ui/game-card";
import { CreateButton } from "./create-button";

export async function GameList() {
    const games = await getIdleGames();
    console.log(games);
    return (
        <Layout
            actions={<CreateButton />}
        >
            {games.map(game => (
                <GameCard 
                    key={game.id} 
                    login={game.creator.login} 
                    rating={game.creator.rating}
                />
            ))}
        </Layout>
    );
}