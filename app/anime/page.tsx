import { getTopAnime } from "@/app/actions";
import CardList from "@/components/cardList";

export const metadata = {
	title: "Anime Ranking | NimeTop",
	description: "Anime ranking based on MAL",
};

export default async function Home() {
	const data = await getTopAnime();

	return (
		<main className="flex w-full flex-col items-center space-y-10">
			<CardList title="Top Anime" data={data.data} err={data.error} />
		</main>
	);
}
