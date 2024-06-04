import { getTopAnime } from "@/app/actions";
import CardList from "@/components/cardList";

export default async function Home() {
	const data = await getTopAnime();

	return (
		<main className="w-full flex flex-col items-center space-y-10">
			<CardList title="Top Anime" data={data.data} err={data.error} />
		</main>
	);
}
