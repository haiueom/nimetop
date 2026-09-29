import { getCharacterById } from "@/app/actions";
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
	const result = await getCharacterById(Number(id));
	if (result.data) {
		const name = result.data.name.full || "Character";
		return {
			title: `${name} | NimeTop`,
			description:
				result.data.description?.replace(/<[^>]*>/g, "").slice(0, 160) ??
				`Character details for ${name}`,
		};
	}
	return { title: "Character Not Found | NimeTop" };
}

export default async function CharacterDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const result = await getCharacterById(Number(id));

	if (result.error.isError || !result.data) {
		return (
			<main className="flex w-full flex-col items-center space-y-10">
				<div className="space-y-4 text-center">
					<h1 className="text-2xl font-bold">Failed to load character</h1>
					<p className="text-muted-foreground">{result.error.message}</p>
					<Button asChild>
						<Link href="/character">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Character
						</Link>
					</Button>
				</div>
			</main>
		);
	}

	const character = result.data;
	const name = character.name.full || "Character";
	const coverSrc = character.image.large || character.image.medium || "";

	return (
		<main className="flex w-full flex-col items-center space-y-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/character">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back
					</Link>
				</Button>
				{character.siteUrl && (
					<Button variant="outline" size="sm" asChild>
						<Link href={character.siteUrl} target="_blank">
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
								alt={name}
								className="object-cover"
								priority
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-muted" />
						)}
					</div>
					{typeof character.favourites === "number" && (
						<div className="flex flex-wrap gap-2">
							<Badge variant="default">
								Favorites: {character.favourites.toLocaleString()}
							</Badge>
						</div>
					)}
				</div>

				<div className="space-y-4">
					<div>
						<h1 className="text-3xl font-bold">{name}</h1>
						{character.name.native && (
							<p className="text-lg text-muted-foreground">
								{character.name.native}
							</p>
						)}
					</div>

					{character.name.alternative &&
						character.name.alternative.length > 0 && (
							<div>
								<p className="mb-2 font-semibold">Nicknames / Alternative Names</p>
								<div className="flex flex-wrap gap-2">
									{character.name.alternative.map((alt, index) => (
										<Badge key={index} variant="secondary">
											{alt}
										</Badge>
									))}
								</div>
							</div>
						)}

					{character.description && (
						<div>
							<h2 className="mb-2 text-lg font-semibold">About</h2>
							<div
								className="leading-relaxed text-muted-foreground [&>p]:mb-2"
								dangerouslySetInnerHTML={{ __html: character.description }}
							/>
						</div>
					)}
				</div>
			</div>

			{character.media?.nodes && character.media.nodes.length > 0 && (
				<div className="w-full space-y-4">
					<h2 className="text-2xl font-bold">Appearances</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{character.media.nodes.map((item) => {
							const itemTitle =
								item.title?.english || item.title?.romaji || "Untitled";
							const imgSrc =
								item.coverImage?.large || item.coverImage?.medium || "";
							const href =
								item.type === "ANIME"
									? `/anime/${item.id}`
									: `/manga/${item.id}`;
							return (
								<div
									key={item.id}
									className="flex items-center gap-3 rounded-lg border p-3"
								>
									<div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
										{imgSrc && (
											<Image
												src={imgSrc}
												fill
												sizes="48px"
												alt={itemTitle}
												className="object-cover"
											/>
										)}
									</div>
									<div className="min-w-0 flex-1">
										<Link
											href={href}
											className="line-clamp-1 font-medium hover:underline"
										>
											{itemTitle}
										</Link>
										<p className="text-sm text-muted-foreground">
											{item.type}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</main>
	);
}
