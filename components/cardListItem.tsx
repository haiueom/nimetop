import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

export default function CardListItem({
	item,
	index,
}: {
	item: any;
	index: number;
}) {
	return (
		<div className="flex flex-col space-y-2">
			<AspectRatio
				ratio={2 / 3}
				className="cursor-pointer duration-200 ease-in-out hover:scale-105"
			>
				<Image
					src={
						item.images.jpg.image_url || item.images.webp.image_url
					}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					alt={item.title || item.name}
					placeholder="blur"
					blurDataURL={
						item.images.jpg.smal_image_url ||
						item.images.jpg.image_url ||
						item.images.webp.small_image_url ||
						item.images.webp.image_url
					}
					className="rounded-md object-cover shadow-lg"
				/>
				<Badge variant="default" className="absolute left-1 top-1">
					#{index + 1}
				</Badge>
				{item.score && (
					<Badge
						variant="secondary"
						className="absolute right-1 top-1"
					>
						{item.score}
					</Badge>
				)}
			</AspectRatio>
			<h2 className="line-clamp-2 font-bold">
				{item.title || item.name}
			</h2>
		</div>
	);
}
