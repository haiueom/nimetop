import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CarouselItem } from "@/components/ui/carousel";

const CardSliderItem = ({ item }: { item: any }) => {
	return (
		<CarouselItem className="h-fit basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6">
			<div className="flex flex-col space-y-2">
				<AspectRatio ratio={2 / 3} className="cursor-grab">
					<Image
						src={
							item.images.jpg.image_url ||
							item.images.webp.image_url
						}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						alt={item.title || item.name}
						placeholder="blur"
						blurDataURL={
							item.images.jpg.image_url ||
							item.images.webp.small_image_url ||
							item.images.jpg.smal_image_url ||
							item.images.webp.image_url
						}
						className="rounded-md object-cover shadow-lg"
					/>
				</AspectRatio>
				<h2 className="line-clamp-2 font-bold">
					{item.title || item.name}
				</h2>
			</div>
		</CarouselItem>
	);
};

export default CardSliderItem;
