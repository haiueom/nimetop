import { getTopStaff } from "@/app/actions";
import CardList from "@/components/cardList";

export const revalidate = 600;

export const metadata = {
	title: "Staff Ranking | NimeTop",
	description: "Staff ranking based on AniList",
};

export default async function Home() {
	const data = await getTopStaff();

	return (
		<main className="flex w-full flex-col items-center space-y-10">
			<CardList title="Top Staff" data={data.data} err={data.error} />
		</main>
	);
}
