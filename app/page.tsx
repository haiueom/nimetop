import Hero from "@/components/hero";
import {
	getTopAnime,
	getTopCharacter,
	getTopManga,
	getTopPeople,
} from "@/app/actions";
import CardSlider from "@/components/cardSlider";

export default async function Home() {
	const ta = await getTopAnime();
	const tm = await getTopManga();
	const tp = await getTopPeople();
	const tc = await getTopCharacter();

	return (
		<main className="w-full flex flex-col items-center space-y-10">
			<Hero />
			<CardSlider
				href="/anime"
				title="Top Anime"
				data={ta.data}
				err={ta.error}
			/>
			<CardSlider
				href="/manga"
				title="Top Manga"
				data={tm.data}
				err={tm.error}
			/>
			<CardSlider
				href="/character"
				title="Top Character"
				data={tc.data}
				err={tc.error}
			/>
			<CardSlider
				href="/people"
				title="Top People"
				data={tp.data}
				err={tp.error}
			/>
		</main>
	);
}
