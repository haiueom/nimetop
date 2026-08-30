import { getMangaById } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const { id } = await params;
	const result = await getMangaById(Number(id));
	if (result.data) {
		return {
			title: `${result.data.title} | NimeTop`,
			description: result.data.synopsis?.slice(0, 160) ?? `Manga details for ${result.data.title}`,
		};
	}
	return { title: "Manga Not Found | NimeTop" };
}

export default async function MangaDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const result = await getMangaById(Number(id));

	if (result.error.isError || !result.data) {
		return (
			<main className="flex w-full flex-col items-center space-y-10">
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-bold">Failed to load manga</h1>
					<p className="text-muted-foreground">{result.error.message}</p>
					<Button asChild>
						<Link href="/manga">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Manga
						</Link>
					</Button>
				</div>
			</main>
		);
	}

	const manga = result.data;

	return (
		<main className="flex w-full flex-col items-center space-y-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/manga">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back
					</Link>
				</Button>
				<Button variant="outline" size="sm" asChild>
					<Link href={manga.url} target="_blank">
						<ExternalLink className="mr-2 h-4 w-4" /> MyAnimeList
					</Link>
				</Button>
			</div>

			<div className="grid w-full gap-6 md:grid-cols-[300px_1fr]">
				<div className="space-y-4">
					<div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
						<Image
							src={manga.images.webp?.large_image_url || manga.images.jpg.large_image_url || ""}
							fill
							sizes="(max-width: 768px) 100vw, 300px"
							alt={manga.title}
							className="object-cover"
							priority
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						{manga.rank && <Badge variant="default">Rank #{manga.rank}</Badge>}
						{manga.score && <Badge variant="secondary">Score: {manga.score}</Badge>}
						{manga.type && <Badge variant="outline">{manga.type}</Badge>}
						{manga.status && <Badge variant="outline">{manga.status}</Badge>}
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<h1 className="text-3xl font-bold">{manga.title}</h1>
						{manga.title_japanese && (
							<p className="text-lg text-muted-foreground">{manga.title_japanese}</p>
						)}
						{manga.title_english && manga.title_english !== manga.title && (
							<p className="text-muted-foreground">{manga.title_english}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
						{manga.volumes && (
							<div>
								<p className="font-semibold">Volumes</p>
								<p className="text-muted-foreground">{manga.volumes}</p>
							</div>
						)}
						{manga.chapters && (
							<div>
								<p className="font-semibold">Chapters</p>
								<p className="text-muted-foreground">{manga.chapters}</p>
							</div>
						)}
						{manga.popularity && (
							<div>
								<p className="font-semibold">Popularity</p>
								<p className="text-muted-foreground">#{manga.popularity}</p>
							</div>
						)}
						{manga.members && (
							<div>
								<p className="font-semibold">Members</p>
								<p className="text-muted-foreground">{manga.members.toLocaleString()}</p>
							</div>
						)}
					</div>

					{manga.genres.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Genres</p>
							<div className="flex flex-wrap gap-2">
								{manga.genres.map((genre) => (
									<Badge key={genre.mal_id} variant="secondary">
										{genre.name}
									</Badge>
								))}
							</div>
						</div>
					)}

					{manga.themes && manga.themes.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Themes</p>
							<div className="flex flex-wrap gap-2">
								{manga.themes.map((theme) => (
									<Badge key={theme.mal_id} variant="outline">
										{theme.name}
									</Badge>
								))}
							</div>
						</div>
					)}

					{manga.demographics && manga.demographics.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Demographics</p>
							<div className="flex flex-wrap gap-2">
								{manga.demographics.map((demo) => (
									<span key={demo.mal_id} className="text-muted-foreground">
										{demo.name}
									</span>
								))}
							</div>
						</div>
					)}

					{manga.authors && manga.authors.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Authors</p>
							<div className="flex flex-wrap gap-2">
								{manga.authors.map((author) => (
									<span key={author.mal_id} className="text-muted-foreground">
										{author.name}
									</span>
								))}
							</div>
						</div>
					)}

					{manga.synopsis && (
						<div>
							<h2 className="mb-2 text-lg font-semibold">Synopsis</h2>
							<p className="leading-relaxed text-muted-foreground">{manga.synopsis}</p>
						</div>
					)}

					{manga.background && (
						<div>
							<h2 className="mb-2 text-lg font-semibold">Background</h2>
							<p className="leading-relaxed text-muted-foreground">{manga.background}</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
