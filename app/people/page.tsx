import { getTopPeople } from "@/app/actions";
import CardList from "@/components/cardList";

export default async function Home() {
	const data = await getTopPeople();

	return (
		<main className="w-full flex flex-col items-center space-y-10">
			<CardList title="Top People" data={data.data} err={data.error} />
		</main>
	);
}
