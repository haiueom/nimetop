import Hero from "@/components/hero";
import {
	getTopAnime,
	getTopCharacter,
	getTopManga,
	getTopPeople,
	getBannerImages,
} from "@/app/actions";
import CardSlider from "@/components/cardSlider";

export const revalidate = 600;

export default async function Home() {
	const [ta, tm, tp, tc, images] = await Promise.all([
		getTopAnime(),
		getTopManga(),
		getTopPeople(),
		getTopCharacter(),
		getBannerImages(),
	]);

	return (
		<main className="flex w-full flex-col items-center space-y-10">
			<Hero images={images} />
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
