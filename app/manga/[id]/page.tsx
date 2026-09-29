import { getMangaById } from "@/app/actions";
import Image from "next/image";
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
	const result = await getMangaById(Number(id));
	if (result.data) {
		const title =
			result.data.title.english ||
			result.data.title.romaji ||
			result.data.title.native ||
			"Manga";
		return {
			title: `${title} | NimeTop`,
			description:
				result.data.description?.replace(/<[^>]*>/g, "").slice(0, 160) ??
				`Manga details for ${title}`,
		};
	}
	return { title: "Manga Not Found | NimeTop" };
}

export default async function MangaDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const result = await getMangaById(Number(id));

	if (result.error.isError || !result.data) {
		return (
			<main className="flex w-full flex-col items-center space-y-10">
				<div className="space-y-4 text-center">
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
	const title = manga.title.english || manga.title.romaji || manga.title.native || "Manga";
	const coverSrc = manga.coverImage.extraLarge || manga.coverImage.large || manga.coverImage.medium || "";
	const rank = manga.rankings?.find((r) => r.type === "RATED")?.rank;
	const score = manga.averageScore ? (manga.averageScore / 10).toFixed(1) : null;

	return (
		<main className="flex w-full flex-col items-center space-y-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/manga">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back
					</Link>
				</Button>
				{manga.siteUrl && (
					<Button variant="outline" size="sm" asChild>
						<Link href={manga.siteUrl} target="_blank">
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
						{manga.format && <Badge variant="outline">{manga.format}</Badge>}
						{manga.status && <Badge variant="outline">{manga.status}</Badge>}
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<h1 className="text-3xl font-bold">{title}</h1>
						{manga.title.native && (
							<p className="text-lg text-muted-foreground">{manga.title.native}</p>
						)}
						{manga.title.romaji && manga.title.english && manga.title.romaji !== manga.title.english && (
							<p className="text-muted-foreground">{manga.title.romaji}</p>
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
						{manga.favourites && (
							<div>
								<p className="font-semibold">Favorites</p>
								<p className="text-muted-foreground">
									{manga.favourites.toLocaleString()}
								</p>
							</div>
						)}
					</div>

					{manga.genres && manga.genres.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Genres</p>
							<div className="flex flex-wrap gap-2">
								{manga.genres.map((genre) => (
									<Badge key={genre} variant="secondary">
										{genre}
									</Badge>
								))}
							</div>
						</div>
					)}

					{manga.staff?.edges && manga.staff.edges.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Authors / Staff</p>
							<div className="flex flex-wrap gap-2">
								{manga.staff.edges.map((edge, idx) => (
									<Link
										key={idx}
										href={`/staff/${edge.node.id}`}
										className="text-muted-foreground hover:underline"
									>
										{edge.node.name.full} ({edge.role})
									</Link>
								))}
							</div>
						</div>
					)}

					{manga.description && (
						<div>
							<h2 className="mb-2 text-lg font-semibold">Synopsis</h2>
							<div
								className="leading-relaxed text-muted-foreground [&>p]:mb-2"
								dangerouslySetInnerHTML={{ __html: manga.description }}
							/>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
