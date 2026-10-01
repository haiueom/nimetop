import { getAnimeById } from "@/app/actions";
import Image from "next/image";
import { sanitizeHtml } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const result = await getAnimeById(Number(id));
	if (result.data) {
		const title =
			result.data.title.english ||
			result.data.title.romaji ||
			result.data.title.native ||
			"Anime";
		return {
			title: `${title} | NimeTop`,
			description:
				result.data.description?.replace(/<[^>]*>/g, "").slice(0, 160) ??
				`Anime details for ${title}`,
		};
	}
	return { title: "Anime Not Found | NimeTop" };
}

export default async function AnimeDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const result = await getAnimeById(Number(id));

	if (result.error.isError || !result.data) {
		return (
			<main className="flex w-full flex-col items-center space-y-10">
				<div className="space-y-4 text-center">
					<h1 className="text-2xl font-bold">Failed to load anime</h1>
					<p className="text-muted-foreground">{result.error.message}</p>
					<Button asChild>
						<Link href="/anime">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Anime
						</Link>
					</Button>
				</div>
			</main>
		);
	}

	const anime = result.data;
	const title = anime.title.english || anime.title.romaji || anime.title.native || "Anime";
	const coverSrc = anime.coverImage.extraLarge || anime.coverImage.large || anime.coverImage.medium || "";
	const rank = anime.rankings?.find((r) => r.type === "RATED")?.rank;
	const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;

	return (
		<main className="flex w-full flex-col items-center space-y-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/anime">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back
					</Link>
				</Button>
				{anime.siteUrl && (
					<Button variant="outline" size="sm" asChild>
						<Link href={anime.siteUrl} target="_blank">
							<ExternalLink className="mr-2 h-4 w-4" /> AniList
						</Link>
					</Button>
				)}
			</div>

			<div className="grid w-full gap-6 md:grid-cols-[300px_1fr]">
				<div className="space-y-4">
					<div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
						{coverSrc ? (
							<Image
								src={coverSrc}
								fill
								sizes="(max-width: 768px) 100vw, 300px"
								alt={title}
								className="object-cover"
								priority
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-muted" />
						)}
					</div>
					<div className="flex flex-wrap gap-2">
						{rank && <Badge variant="default">Rank #{rank}</Badge>}
						{score && <Badge variant="secondary">Score: {score}</Badge>}
						{anime.format && <Badge variant="outline">{anime.format}</Badge>}
						{anime.status && <Badge variant="outline">{anime.status}</Badge>}
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<h1 className="text-3xl font-bold">{title}</h1>
						{anime.title.native && (
							<p className="text-lg text-muted-foreground">{anime.title.native}</p>
						)}
						{anime.title.romaji && anime.title.english && anime.title.romaji !== anime.title.english && (
							<p className="text-muted-foreground">{anime.title.romaji}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
						{anime.episodes && (
							<div>
								<p className="font-semibold">Episodes</p>
								<p className="text-muted-foreground">{anime.episodes}</p>
							</div>
						)}
						{anime.duration && (
							<div>
								<p className="font-semibold">Duration</p>
								<p className="text-muted-foreground">{anime.duration} mins</p>
							</div>
						)}
						{anime.source && (
							<div>
								<p className="font-semibold">Source</p>
								<p className="text-muted-foreground">{anime.source}</p>
							</div>
						)}
						{anime.season && anime.seasonYear && (
							<div>
								<p className="font-semibold">Season</p>
								<p className="text-muted-foreground">
									{anime.season} {anime.seasonYear}
								</p>
							</div>
						)}
						{anime.popularity && (
							<div>
								<p className="font-semibold">Popularity</p>
								<p className="text-muted-foreground">#{anime.popularity}</p>
							</div>
						)}
						{anime.favourites && (
							<div>
								<p className="font-semibold">Favorites</p>
								<p className="text-muted-foreground">
									{anime.favourites.toLocaleString()}
								</p>
							</div>
						)}
					</div>

					{anime.genres && anime.genres.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Genres</p>
							<div className="flex flex-wrap gap-2">
								{anime.genres.map((genre) => (
									<Badge key={genre} variant="secondary">
										{genre}
									</Badge>
								))}
							</div>
						</div>
					)}

					{anime.studios?.nodes && anime.studios.nodes.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Studios</p>
							<div className="flex flex-wrap gap-2">
								{anime.studios.nodes.map((studio, idx) => (
									<span key={idx} className="text-muted-foreground">
										{studio.name}
									</span>
								))}
							</div>
						</div>
					)}

					{anime.description && (
						<div>
							<h2 className="mb-2 text-lg font-semibold">Synopsis</h2>
							<div
								className="leading-relaxed text-muted-foreground [&>p]:mb-2"
								dangerouslySetInnerHTML={{ __html: sanitizeHtml(anime.description) }}
							/>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
