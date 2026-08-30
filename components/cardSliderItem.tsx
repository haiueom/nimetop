import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CarouselItem } from "@/components/ui/carousel";
import type { JikanItem } from "@/lib/types/jikan";

const getHref = (item: JikanItem): string => {
	if ("episodes" in item) return `/anime/${item.mal_id}`;
	if ("chapters" in item || "volumes" in item) return `/manga/${item.mal_id}`;
	return "#";
};

const CardSliderItem = ({ item }: { item: JikanItem }) => {
	const src = item.images.webp?.image_url || item.images.jpg.image_url;
	const blur = item.images.webp?.small_image_url || item.images.jpg.small_image_url;
	const label = "title" in item ? item.title : item.name;
	const href = getHref(item);

	return (
		<CarouselItem className="h-fit basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6">
			<Link href={href} className="flex flex-col space-y-2">
				<AspectRatio ratio={2 / 3} className="cursor-grab overflow-hidden rounded-md">
					<Image
						src={src}
						fill
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
						alt={label}
						placeholder="blur"
						blurDataURL={blur}
						className="object-cover shadow-lg transition-transform duration-200 hover:scale-105"
					/>
				</AspectRatio>
				<h2 className="line-clamp-2 font-bold">{label}</h2>
			</Link>
		</CarouselItem>
	);
};

export default CardSliderItem;
