import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
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

export default function CardListItem({
	item,
	index,
}: {
	item: AniListItem;
	index: number;
}) {
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
	const score =
		"averageScore" in item && typeof item.averageScore === "number"
			? (item.averageScore / 10).toFixed(1)
			: null;
	const href = getHref(item);

	const content = (
		<>
			<AspectRatio
				ratio={2 / 3}
				className="cursor-pointer overflow-hidden rounded-md duration-200 ease-in-out hover:scale-105"
			>
				{src ? (
					<Image
						src={src}
						fill
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
						alt={label}
						placeholder="blur"
						blurDataURL={blur}
						className="object-cover shadow-lg"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-muted" />
				)}
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
