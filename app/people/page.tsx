import { getTopPeople } from "@/app/actions";
import CardList from "@/components/cardList";

export const metadata = {
	title: "People Ranking | NimeTop",
	description: "People ranking based on MAL",
};

export default async function Home() {
	const data = await getTopPeople();

	return (
		<main className="flex w-full flex-col items-center space-y-10">
			<CardList title="Top People" data={data.data} err={data.error} />
		</main>
	);
}
