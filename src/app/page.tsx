import { GameList } from "@/features/games-list/containers/game-list";

export default async function Home() {
  return (
    // width 
    <div className="flex flex-col gap-8 container mx-auto pt-[100px] w-[1100px]"> 
      <h1 className="text-4xl font-bold">Игры</h1>
      <GameList/>
    </div>
  );
}
