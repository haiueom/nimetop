import { getStaffById } from "@/app/actions";
import Image from "next/image";
import { sanitizeHtml } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const revalidate = 600;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const result = await getStaffById(Number(id));
	if (result.data) {
		const name = result.data.name.full || "Staff";
		return {
			title: `${name} | NimeTop`,
			description:
				result.data.description?.replace(/<[^>]*>/g, "").slice(0, 160) ??
				`Profile for ${name}`,
		};
	}
	return { title: "Staff Not Found | NimeTop" };
}

function formatDate(dob: { year?: number | null; month?: number | null; day?: number | null } | null | undefined): string | null {
	if (!dob || (!dob.year && !dob.month && !dob.day)) return null;
	if (dob.year && dob.month && dob.day) {
		try {
			const date = new Date(dob.year, dob.month - 1, dob.day);
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch {
			return `${dob.year}-${dob.month}-${dob.day}`;
		}
	}
	return [dob.year, dob.month, dob.day].filter(Boolean).join("-");
}

export default async function StaffDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const result = await getStaffById(Number(id));

	if (result.error.isError || !result.data) {
		return (
			<main className="flex w-full flex-col items-center space-y-10">
				<div className="space-y-4 text-center">
					<h1 className="text-2xl font-bold">Failed to load staff member</h1>
					<p className="text-muted-foreground">{result.error.message}</p>
					<Button asChild>
						<Link href="/staff">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Staff
						</Link>
					</Button>
				</div>
			</main>
		);
	}

	const staff = result.data;
	const birthday = formatDate(staff.dateOfBirth);
	const name = staff.name.full || "Unknown";

	return (
		<main className="flex w-full flex-col items-center space-y-6">
			<div className="flex w-full items-center justify-between">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/staff">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back
					</Link>
				</Button>
				<div className="flex gap-2">
					{staff.siteUrl && (
						<Button variant="outline" size="sm" asChild>
							<Link href={staff.siteUrl} target="_blank">
								<ExternalLink className="mr-2 h-4 w-4" /> AniList
							</Link>
						</Button>
					)}
				</div>
			</div>

			<div className="grid w-full gap-6 md:grid-cols-[300px_1fr]">
				<div className="space-y-4">
					<div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
						{staff.image?.large ? (
							<Image
								src={staff.image.large}
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
					{typeof staff.favourites === "number" && (
						<div className="flex flex-wrap gap-2">
							<Badge variant="default">
								Favorites: {staff.favourites.toLocaleString()}
							</Badge>
						</div>
					)}
				</div>

				<div className="space-y-4">
					<div>
						<h1 className="text-3xl font-bold">{name}</h1>
						{staff.name.native && (
							<p className="text-lg text-muted-foreground">
								{staff.name.native}
							</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
						{birthday && (
							<div>
								<p className="font-semibold">Birthday</p>
								<p className="text-muted-foreground">{birthday}</p>
							</div>
						)}
						{staff.homeTown && (
							<div>
								<p className="font-semibold">Hometown</p>
								<p className="text-muted-foreground">{staff.homeTown}</p>
							</div>
						)}
						{typeof staff.favourites === "number" && (
							<div>
								<p className="font-semibold">Favorites</p>
								<p className="text-muted-foreground">
									{staff.favourites.toLocaleString()}
								</p>
							</div>
						)}
					</div>

					{staff.primaryOccupations && staff.primaryOccupations.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Primary Occupations</p>
							<div className="flex flex-wrap gap-2">
								{staff.primaryOccupations.map((occupation, index) => (
									<Badge key={index} variant="secondary">
										{occupation}
									</Badge>
								))}
							</div>
						</div>
					)}

					{staff.name.alternative && staff.name.alternative.length > 0 && (
						<div>
							<p className="mb-2 font-semibold">Alternative Names</p>
							<div className="flex flex-wrap gap-2">
								{staff.name.alternative.map((altName, index) => (
									<Badge key={index} variant="outline">
										{altName}
									</Badge>
								))}
							</div>
						</div>
					)}

					{staff.description && (
						<div>
							<h2 className="mb-2 text-lg font-semibold">About</h2>
							<div
								className="leading-relaxed text-muted-foreground [&>p]:mb-2"
								dangerouslySetInnerHTML={{ __html: sanitizeHtml(staff.description) }}
							/>
						</div>
					)}
				</div>
			</div>

			{staff.staffMedia?.nodes && staff.staffMedia.nodes.length > 0 && (
				<div className="w-full space-y-4">
					<h2 className="text-2xl font-bold">Media Worked On</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{staff.staffMedia.nodes.map((item) => {
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

			{staff.characters?.nodes && staff.characters.nodes.length > 0 && (
				<div className="w-full space-y-4">
					<h2 className="text-2xl font-bold">Characters Voiced / Created</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{staff.characters.nodes.map((char) => {
							const charName = char.name?.full || "Unknown Character";
							const imgSrc = char.image?.large || char.image?.medium || "";
							return (
								<div
									key={char.id}
									className="flex items-center gap-3 rounded-lg border p-3"
								>
									<div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
										{imgSrc && (
											<Image
												src={imgSrc}
												fill
												sizes="48px"
												alt={charName}
												className="object-cover"
											/>
										)}
									</div>
									<div className="min-w-0 flex-1">
										<Link
											href={`/character/${char.id}`}
											className="line-clamp-1 font-medium hover:underline"
										>
											{charName}
										</Link>
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
