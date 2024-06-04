"use client";
import {
	Carousel,
	CarouselContent,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CardListItem from "@/components/cardSliderItem";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function CardSlider({
	title,
	data,
	err,
	href,
}: {
	title: string;
	data: any;
	err: {
		isError: boolean;
		message: string;
		errMsg: any;
	};
	href: string;
}) {
	return (
		<section className="w-full space-y-4">
			<div className="flex justify-between">
				<h2 className="text-2xl font-bold">{title}</h2>
				<Button variant="secondary" size="sm" asChild>
					<Link href={href} className="font-bold">
						View all <ArrowRight className="pl-1" />
					</Link>
				</Button>
			</div>
			{err.isError ? (
				<Card className="p-4 shadow-md bg-secondary w-full h-[200px] text-center flex items-center justify-center">
					<p className="text-red-500 font-bold text-md">
						{err.message}
					</p>
				</Card>
			) : (
				<Carousel
					opts={{
						dragFree: true,
					}}
					className="w-full"
				>
					<CarouselContent className="-ml-2 md:-ml-4">
						{data.map((item: any) => (
							<CardListItem item={item} key={item.mal_id} />
						))}
					</CarouselContent>
					<CarouselPrevious className="hidden lg:flex" />
					<CarouselNext className="hidden lg:flex" />
				</Carousel>
			)}
		</section>
	);
}
