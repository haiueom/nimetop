import Hero from "@/components/hero";
import {
	getTopAnime,
	getTopCharacter,
	getTopManga,
	getTopStaff,
	getBannerImages,
} from "@/app/actions";
import CardSlider from "@/components/cardSlider";

export const revalidate = 600;

export default async function Home() {
	const [ta, tm, tp, tc, images] = await Promise.all([
		getTopAnime(),
		getTopManga(),
		getTopStaff(),
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
				href="/staff"
				title="Top Staff"
				data={tp.data}
				err={tp.error}
			/>
		</main>
	);
}
