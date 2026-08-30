import { getPersonById } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const { id } = await params;
	const result = await getPersonById(Number(id));
	if (result.data) {
		return {
			title: `${result.data.name} | NimeTop`,
			description: result.data.about?.slice(0, 160) ?? `Profile for ${result.data.name}`,
		};
	}
	return { title: "Person Not Found | NimeTop" };
}

function formatDate(dateString: string | null): string | null {
	if (!dateString) return null;
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch {
		return dateString;
	}
}

export default async function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const result = await getPersonById(Number(id));

	if (result.error.isError || !result.data) {
		return (
			<main className="flex w-full flex-col items-center space-y-10">
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-bold">Failed to load person</h1>
					<p className="text-muted-foreground">{result.error.message}</p>
					<Button asChild>
						<Link href="/people">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to People
						</Link>
					</Button>
				</div>
			</main>
		);
	}

	const person = result.data;
	const birthday = formatDate(person.birthday);

	return (
		<main className="flex w-full flex-col items-center space-y-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/people">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back
					</Link>
				</Button>
				<div className="flex gap-2">
					{person.website_url && (
						<Button variant="outline" size="sm" asChild>
							<Link href={person.website_url} target="_blank">
								<Globe className="mr-2 h-4 w-4" /> Website
							</Link>
						</Button>
					)}
					<Button variant="outline" size="sm" asChild>
						<Link href={person.url} target="_blank">
							<ExternalLink className="mr-2 h-4 w-4" /> MyAnimeList
						</Link>
					</Button>
				</div>
			</div>

			<div className="grid w-full gap-6 md:grid-cols-[300px_1fr]">
				<div className="space-y-4">
					<div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
						<Image
							src={person.images.webp?.large_image_url || person.images.jpg.large_image_url || ""}
							fill
							sizes="(max-width: 768px) 100vw, 300px"
							alt={person.name}
							className="object-cover"
							priority
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						<Badge variant="default">Favorites: {person.favorites.toLocaleString()}</Badge>
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<h1 className="text-3xl font-bold">{person.name}</h1>
						{person.given_name && (
							<p className="text-lg text-muted-foreground">Given: {person.given_name}</p>
						)}
						{person.family_name && (
							<p className="text-muted-foreground">Family: {person.family_name}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
						{birthday && (
							<div>
								<p className="font-semibold">Birthday</p>
								<p className="text-muted-foreground">{birthday}</p>
							</div>
						)}
						<div>
							<p className="font-semibold">Favorites</p>
							<p className="text-muted-foreground">{person.favorites.toLocaleString()}</p>
						</div>
					</div>

					{person.alternate_names.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Alternate Names</p>
							<div className="flex flex-wrap gap-2">
								{person.alternate_names.map((name, index) => (
									<Badge key={index} variant="secondary">
										{name}
									</Badge>
								))}
							</div>
						</div>
					)}

					{person.about && (
						<div>
							<h2 className="mb-2 text-lg font-semibold">About</h2>
							<p className="leading-relaxed text-muted-foreground whitespace-pre-line">{person.about}</p>
						</div>
					)}
				</div>
			</div>

			{person.anime.length > 0 && (
				<div className="w-full space-y-4">
					<h2 className="text-2xl font-bold">Anime</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{person.anime.map((item, index) => (
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
									<p className="text-sm text-muted-foreground">{item.position}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{person.manga.length > 0 && (
				<div className="w-full space-y-4">
					<h2 className="text-2xl font-bold">Manga</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{person.manga.map((item, index) => (
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
									<p className="text-sm text-muted-foreground">{item.position}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{person.voices.length > 0 && (
				<div className="w-full space-y-4">
					<h2 className="text-2xl font-bold">Voice Acting Roles</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{person.voices.map((item, index) => (
							<div
								key={`${item.anime.mal_id}-${item.character.mal_id}-${index}`}
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
									<p className="text-sm text-muted-foreground">
										{item.character.name} ({item.role})
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</main>
	);
}
