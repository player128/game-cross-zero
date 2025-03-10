import { sessionServise } from "@/entities/user/server";
import { Button } from "@/shared/ui/button";
import { redirect } from "next/navigation";

export default async function PrivateLayout({
    children,
}: {children: React.ReactNode}) {
    const { session } = await sessionServise.verifySession();

    return <div>
        <header className="px-10 py-4 flex flex-row gap-4 justify-between border-b border-b-primary/50 items-center">
            <div className="text-xl">Tik-tak-toe-online</div>
            <div className="flex gap-4 items-center">
                <div className="text-lg">{session.login}</div> 
                <form action={async () => {
                    'use server';

                    sessionServise.deleteSession();
                    redirect('/sign-in');
                }}>
                    <Button>Sign out</Button>
                </form>
            </div>
        </header>
        {children}
    </div>
}