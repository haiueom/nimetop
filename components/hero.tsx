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

export default function Hero({
	images,
}: {
	images: {
		src: string;
		alt: string;
	}[];
}) {
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
				{images.map((item, index) => (
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
