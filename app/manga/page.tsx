import { getTopManga } from "@/app/actions";
import CardList from "@/components/cardList";

export const revalidate = 600;

export const metadata = {
	title: "Manga Ranking | NimeTop",
	description: "Manga ranking based on AniList",
};

export default async function Home() {
	const data = await getTopManga();

	return (
		<main className="flex w-full flex-col items-center space-y-10">
			<CardList title="Top Manga" data={data.data} err={data.error} />
		</main>
	);
}
