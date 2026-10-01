/**
 * Skeleton for one carousel slot. Renders plain divs (no CarouselItem) so it can
 * be used inside a loading boundary without a client component.
 * ponytail: no embla import in loading states — see app/loading.tsx.
 */
export default function CardSliderSkeleton({ count = 6 }: { count?: number }) {
	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="flex flex-col space-y-2">
					<div className="aspect-[2/3] overflow-hidden rounded-md bg-muted" />
					<div className="h-4 w-full rounded-md bg-muted" />
					<div className="h-4 w-2/3 rounded-md bg-muted" />
				</div>
			))}
		</>
	);
}
