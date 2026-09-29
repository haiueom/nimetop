import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CarouselItem } from "@/components/ui/carousel";
import type { AniListItem } from "@/lib/types/anilist";

const getHref = (item: AniListItem): string => {
	if ("type" in item && (item.type === "ANIME" || item.type === "MANGA")) {
		return item.type === "ANIME" ? `/anime/${item.id}` : `/manga/${item.id}`;
	}
	if ("primaryOccupations" in item || "staffMedia" in item) {
		return `/staff/${item.id}`;
	}
	if ("media" in item || "image" in item) {
		return `/character/${item.id}`;
	}
	return "#";
};

const CardSliderItem = ({ item }: { item: AniListItem }) => {
	const src =
		("coverImage" in item
			? item.coverImage?.large || item.coverImage?.medium
			: item.image?.large || item.image?.medium) || "";
	const blur =
		("coverImage" in item
			? item.coverImage?.medium || item.coverImage?.large
			: item.image?.medium || item.image?.large) || "";
	const label =
		("title" in item && item.title
			? item.title.english || item.title.romaji || item.title.native
			: "name" in item && item.name
				? item.name.full
				: "") || "";
	const href = getHref(item);

	return (
		<CarouselItem className="h-fit basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6">
			<Link href={href} className="flex flex-col space-y-2">
				<AspectRatio ratio={2 / 3} className="cursor-grab overflow-hidden rounded-md">
					{src ? (
						<Image
							src={src}
							fill
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
							alt={label}
							placeholder="blur"
							blurDataURL={blur}
							className="object-cover shadow-lg transition-transform duration-200 hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-muted" />
					)}
				</AspectRatio>
				<h2 className="line-clamp-2 font-bold">{label}</h2>
			</Link>
		</CarouselItem>
	);
};

export default CardSliderItem;
