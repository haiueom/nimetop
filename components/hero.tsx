"use client";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Autoplay from "embla-carousel-autoplay";

const items = [
	{
		src: "/img/banner-1.jpg",
		alt: "gambar banner 1",
	},
	{
		src: "/img/banner-2.jpg",
		alt: "gambar banner 2",
	},
	{
		src: "/img/banner-3.jpg",
		alt: "gambar banner 3",
	},
];

export default function Hero() {
	return (
		<Carousel
			className="w-full"
			plugins={[
				Autoplay({
					delay: 5000,
					loop: true,
				}),
			]}
			opts={{
				loop: true,
			}}
		>
			<CarouselContent className="-ml-2 md:-ml-4">
				{items.map((item, index) => (
					<CarouselItem key={index} className="h-fit pl-2 md:pl-4">
						<AspectRatio ratio={3 / 1}>
							<Image
								src={item.src}
								alt={item.alt}
								fill
								className="rounded-md object-cover"
								priority={index === 0 ? true : false}
							/>
						</AspectRatio>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="hidden lg:flex" />
			<CarouselNext className="hidden lg:flex" />
		</Carousel>
	);
}
