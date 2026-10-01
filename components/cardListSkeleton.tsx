import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton grid matching the CardList layout.
 */
export function CardListSkeleton({ title }: { title: string }) {
	return (
		<section className="mt-4 w-full space-y-10">
			<div className="text-center">
				<h2 className="mb-4 text-4xl font-bold">{title}</h2>
				<p>Peringkat berdasarkan AniList.</p>
			</div>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
				{Array.from({ length: 18 }).map((_, i) => (
					<div key={i} className="flex flex-col space-y-2">
						<div className="aspect-[2/3] overflow-hidden rounded-md bg-muted" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-2/3" />
					</div>
				))}
			</div>
		</section>
	);
}
