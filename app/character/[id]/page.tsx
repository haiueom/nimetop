import { getCharacterById } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const { id } = await params;
	const result = await getCharacterById(Number(id));
	if (result.data) {
		return {
			title: `${result.data.name} | NimeTop`,
			description: result.data.about?.slice(0, 160) ?? `Character details for ${result.data.name}`,
		};
	}
	return { title: "Character Not Found | NimeTop" };
}

export default async function CharacterDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const result = await getCharacterById(Number(id));

	if (result.error.isError || !result.data) {
		return (
			<main className="flex w-full flex-col items-center space-y-10">
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-bold">Failed to load character</h1>
					<p className="text-muted-foreground">{result.error.message}</p>
					<Button asChild>
						<Link href="/character">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Characters
						</Link>
					</Button>
				</div>
			</main>
		);
	}

	const character = result.data;

	return (
		<main className="flex w-full flex-col items-center space-y-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/character">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back
					</Link>
				</Button>
				<Button variant="outline" size="sm" asChild>
					<Link href={character.url} target="_blank">
						<ExternalLink className="mr-2 h-4 w-4" /> MyAnimeList
					</Link>
				</Button>
			</div>

			<div className="grid w-full gap-6 md:grid-cols-[300px_1fr]">
				<div className="space-y-4">
					<div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
						<Image
							src={character.images.webp?.large_image_url || character.images.jpg.large_image_url || ""}
							fill
							sizes="(max-width: 768px) 100vw, 300px"
							alt={character.name}
							className="object-cover"
							priority
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						<Badge variant="default">Favorites: {character.favorites.toLocaleString()}</Badge>
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<h1 className="text-3xl font-bold">{character.name}</h1>
						{character.name_kanji && (
							<p className="text-lg text-muted-foreground">{character.name_kanji}</p>
						)}
					</div>

					{character.nicknames.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Nicknames</p>
							<div className="flex flex-wrap gap-2">
								{character.nicknames.map((nickname, index) => (
									<Badge key={index} variant="secondary">
										{nickname}
									</Badge>
								))}
							</div>
						</div>
					)}

					{character.about && (
						<div>
							<h2 className="mb-2 text-lg font-semibold">About</h2>
							<p className="leading-relaxed text-muted-foreground whitespace-pre-line">{character.about}</p>
						</div>
					)}
				</div>
			</div>

			{character.anime.length > 0 && (
				<div className="w-full space-y-4">
					<h2 className="text-2xl font-bold">Anime</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{character.anime.map((item, index) => (
							<div
								key={`${item.anime.mal_id}-${index}`}
								className="flex items-center gap-3 rounded-lg border p-3"
							>
								<div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
									<Image
										src={item.anime.images.webp?.small_image_url || item.anime.images.jpg.small_image_url || ""}
										fill
										sizes="48px"
										alt={item.anime.title}
										className="object-cover"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<Link
										href={`/anime/${item.anime.mal_id}`}
										className="font-medium hover:underline line-clamp-1"
									>
										{item.anime.title}
									</Link>
									<p className="text-sm text-muted-foreground">{item.role}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{character.manga.length > 0 && (
				<div className="w-full space-y-4">
					<h2 className="text-2xl font-bold">Manga</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{character.manga.map((item, index) => (
							<div
								key={`${item.manga.mal_id}-${index}`}
								className="flex items-center gap-3 rounded-lg border p-3"
							>
								<div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
									<Image
										src={item.manga.images.webp?.small_image_url || item.manga.images.jpg.small_image_url || ""}
										fill
										sizes="48px"
										alt={item.manga.title}
										className="object-cover"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<Link
										href={`/manga/${item.manga.mal_id}`}
										className="font-medium hover:underline line-clamp-1"
									>
										{item.manga.title}
									</Link>
									<p className="text-sm text-muted-foreground">{item.role}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{character.voices.length > 0 && (
				<div className="w-full space-y-4">
					<h2 className="text-2xl font-bold">Voice Actors</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{character.voices.map((item, index) => (
							<div
								key={`${item.person.mal_id}-${index}`}
								className="flex items-center gap-3 rounded-lg border p-3"
							>
								<div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
									<Image
										src={item.person.images.webp?.small_image_url || item.person.images.jpg.small_image_url || ""}
										fill
										sizes="48px"
										alt={item.person.name}
										className="object-cover"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<Link
										href={`/people/${item.person.mal_id}`}
										className="font-medium hover:underline line-clamp-1"
									>
										{item.person.name}
									</Link>
									<p className="text-sm text-muted-foreground">{item.language}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</main>
	);
}
