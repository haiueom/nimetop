import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import type { JikanItem } from "@/lib/types/jikan";

const getHref = (item: JikanItem): string => {
	if ("episodes" in item) return `/anime/${item.mal_id}`;
	if ("chapters" in item || "volumes" in item) return `/manga/${item.mal_id}`;
	if ("website_url" in item) return `/people/${item.mal_id}`;
	return "#";
};

export default function CardListItem({
	item,
	index,
}: {
	item: JikanItem;
	index: number;
}) {
	const src = item.images.webp?.image_url || item.images.jpg.image_url;
	const blur = item.images.webp?.small_image_url || item.images.jpg.small_image_url;
	const label = "title" in item ? item.title : item.name;
	const score = "score" in item ? item.score : null;
	const href = getHref(item);

	const content = (
		<>
			<AspectRatio
				ratio={2 / 3}
				className="cursor-pointer overflow-hidden rounded-md duration-200 ease-in-out hover:scale-105"
			>
				<Image
					src={src}
					fill
					sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
					alt={label}
					placeholder="blur"
					blurDataURL={blur}
					className="object-cover shadow-lg"
				/>
				<Badge variant="default" className="absolute left-1 top-1">
					#{index + 1}
				</Badge>
				{score && (
					<Badge
						variant="secondary"
						className="absolute right-1 top-1"
					>
						{score}
					</Badge>
				)}
			</AspectRatio>
			<h2 className="line-clamp-2 font-bold">{label}</h2>
		</>
	);

	if (href !== "#") {
		return (
			<Link href={href} className="flex flex-col space-y-2">
				{content}
			</Link>
		);
	}

	return <div className="flex flex-col space-y-2">{content}</div>;
}
