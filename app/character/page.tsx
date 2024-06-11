import { getTopCharacter } from "@/app/actions";
import CardList from "@/components/cardList";

export const metadata = {
	title: "Character Ranking | NimeTop",
	description: "Character ranking based on MAL",
};

export default async function Home() {
	const data = await getTopCharacter();

	return (
		<main className="flex w-full flex-col items-center space-y-10">
			<CardList title="Top Character" data={data.data} err={data.error} />
		</main>
	);
}
