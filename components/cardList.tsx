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
		<section className="w-full space-y-10 mt-4">
			<div className="text-center">
				<h2 className="text-4xl font-bold mb-4">{title}</h2>
				<p>Peringkat berdasarkan MyAnimeList.</p>
			</div>
			{err.isError ? (
				<Card className="p-4 shadow-md bg-secondary w-full h-[200px] text-center flex items-center justify-center">
					<p className="text-red-500 font-bold text-md">
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
