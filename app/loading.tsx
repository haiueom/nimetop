import CardSliderSkeleton from "@/components/cardSliderSkeleton";

/**
 * Home loading state.
 * ponytail: plain grid instead of embla carousels — instantiating the client-side
 * carousel in a loading boundary breaks the React Server Components manifest.
 * Upgrade path: none needed, this matches the perceived layout closely enough.
 */
export default function HomeLoading() {
	return (
		<main className="flex w-full flex-col items-center space-y-10">
			<div className="flex h-[200px] w-full items-center justify-center bg-muted/30">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
			{Array.from({ length: 4 }).map((_, i) => (
				<section key={i} className="w-full space-y-4">
					<div className="flex justify-between">
						<div className="h-8 w-40 rounded-md bg-muted" />
					</div>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
						<CardSliderSkeleton count={6} />
					</div>
				</section>
			))}
		</main>
	);
}
