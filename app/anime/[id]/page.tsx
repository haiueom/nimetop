import { getAnimeById } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const { id } = await params;
	const result = await getAnimeById(Number(id));
	if (result.data) {
		return {
			title: `${result.data.title} | NimeTop`,
			description: result.data.synopsis?.slice(0, 160) ?? `Anime details for ${result.data.title}`,
		};
	}
	return { title: "Anime Not Found | NimeTop" };
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const result = await getAnimeById(Number(id));

	if (result.error.isError || !result.data) {
		return (
			<main className="flex w-full flex-col items-center space-y-10">
				<div className="text-center space-y-4">
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

	return (
		<main className="flex w-full flex-col items-center space-y-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/anime">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back
					</Link>
				</Button>
				<Button variant="outline" size="sm" asChild>
					<Link href={anime.url} target="_blank">
						<ExternalLink className="mr-2 h-4 w-4" /> MyAnimeList
					</Link>
				</Button>
			</div>

			<div className="grid w-full gap-6 md:grid-cols-[300px_1fr]">
				<div className="space-y-4">
					<div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
						<Image
							src={anime.images.webp?.large_image_url || anime.images.jpg.large_image_url || ""}
							fill
							sizes="(max-width: 768px) 100vw, 300px"
							alt={anime.title}
							className="object-cover"
							priority
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						{anime.rank && <Badge variant="default">Rank #{anime.rank}</Badge>}
						{anime.score && <Badge variant="secondary">Score: {anime.score}</Badge>}
						{anime.type && <Badge variant="outline">{anime.type}</Badge>}
						{anime.status && <Badge variant="outline">{anime.status}</Badge>}
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<h1 className="text-3xl font-bold">{anime.title}</h1>
						{anime.title_japanese && (
							<p className="text-lg text-muted-foreground">{anime.title_japanese}</p>
						)}
						{anime.title_english && anime.title_english !== anime.title && (
							<p className="text-muted-foreground">{anime.title_english}</p>
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
								<p className="text-muted-foreground">{anime.duration}</p>
							</div>
						)}
						{anime.source && (
							<div>
								<p className="font-semibold">Source</p>
								<p className="text-muted-foreground">{anime.source}</p>
							</div>
						)}
						{anime.season && anime.year && (
							<div>
								<p className="font-semibold">Season</p>
								<p className="text-muted-foreground">{anime.season} {anime.year}</p>
							</div>
						)}
						{anime.popularity && (
							<div>
								<p className="font-semibold">Popularity</p>
								<p className="text-muted-foreground">#{anime.popularity}</p>
							</div>
						)}
						{anime.members && (
							<div>
								<p className="font-semibold">Members</p>
								<p className="text-muted-foreground">{anime.members.toLocaleString()}</p>
							</div>
						)}
					</div>

					{anime.genres.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Genres</p>
							<div className="flex flex-wrap gap-2">
								{anime.genres.map((genre) => (
									<Badge key={genre.mal_id} variant="secondary">
										{genre.name}
									</Badge>
								))}
							</div>
						</div>
					)}

					{anime.studios.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Studios</p>
							<div className="flex flex-wrap gap-2">
								{anime.studios.map((studio) => (
									<span key={studio.mal_id} className="text-muted-foreground">
										{studio.name}
									</span>
								))}
							</div>
						</div>
					)}

					{anime.synopsis && (
						<div>
							<h2 className="mb-2 text-lg font-semibold">Synopsis</h2>
							<p className="leading-relaxed text-muted-foreground">{anime.synopsis}</p>
						</div>
					)}

					{anime.background && (
						<div>
							<h2 className="mb-2 text-lg font-semibold">Background</h2>
							<p className="leading-relaxed text-muted-foreground">{anime.background}</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
