import CardListItem from "@/components/cardListItem";
import { Card } from "@/components/ui/card";

export default function CardList({
	title,
	data,
	err,
}: {
	title: string;
	data: any;
	err: {
		isError: boolean;
		message: string;
		errMsg: any;
	};
}) {
	return (
		<section className="mt-4 w-full space-y-10">
			<div className="text-center">
				<h2 className="mb-4 text-4xl font-bold">{title}</h2>
				<p>Peringkat berdasarkan MyAnimeList.</p>
			</div>
			{err.isError ? (
				<Card className="flex h-[200px] w-full items-center justify-center bg-secondary p-4 text-center shadow-md">
					<p className="text-md font-bold text-red-500">
						{err.message}
					</p>
				</Card>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
					{data.slice(0, -1).map((item: any, index: number) => (
						<CardListItem
							item={item}
							key={item.mal_id}
							index={index}
						/>
					))}
				</div>
			)}
		</section>
	);
}
