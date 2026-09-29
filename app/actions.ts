"use server";

import fs from "fs";
import path from "path";
import type {
	AniListMedia,
	AniListCharacter,
	AniListStaff,
	Result,
	SingleResult,
} from "@/lib/types/anilist";

export async function getBannerImages() {
	const imagesDirectory = path.join(process.cwd(), "public/img/banner");
	const filenames = fs.readdirSync(imagesDirectory);
	return filenames.map((filename) => ({
		src: `/img/banner/${filename}`,
		alt: `banner ${filename.replace(/\.[^/.]+$/, "")}`,
	}));
}

const ANILIST_GRAPHQL_ENDPOINT = "https://graphql.anilist.co";
const TIMEOUT_MS = 10_000;
const RETRIES = 3;

async function fetchAniListGraphQL(
	query: string,
	variables: Record<string, unknown>,
	tag: string,
): Promise<any> {
	for (let attempt = 0; attempt < RETRIES; attempt++) {
		try {
			const res = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ query, variables }),
				signal: AbortSignal.timeout(TIMEOUT_MS),
				next: { revalidate: 600, tags: [tag] },
			});

			if (res.status === 429) {
				const retryAfter = Number(res.headers.get("retry-after")) || 2;
				await new Promise((r) => setTimeout(r, retryAfter * 1000));
				continue;
			}

			const json = await res.json();
			if (json.errors || !json.data) {
				const msg = json.errors?.[0]?.message || `Failed to fetch ${tag}`;
				if (attempt < RETRIES - 1) {
					await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
					continue;
				}
				throw new Error(msg);
			}

			return json.data;
		} catch (e) {
			if (attempt < RETRIES - 1) {
				await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
				continue;
			}
			throw e;
		}
	}
	throw new Error(`Failed to fetch ${tag} after ${RETRIES} attempts`);
}

async function fetchAniListList<T>(
	query: string,
	variables: Record<string, unknown>,
	tag: string,
	extractFn: (data: any) => T[],
): Promise<Result<T>> {
	try {
		const data = await fetchAniListGraphQL(query, variables, tag);
		const items = extractFn(data);
		return {
			data: items,
			error: { isError: false, message: "", errMsg: null },
		};
	} catch (e: any) {
		console.error(`Failed to fetch ${tag}:`, e);
		return {
			data: [],
			error: {
				isError: true,
				message: e?.message || `Failed to fetch ${tag}`,
				errMsg: e,
			},
		};
	}
}

async function fetchAniListSingleItem<T>(
	query: string,
	variables: Record<string, unknown>,
	tag: string,
	extractFn: (data: any) => T | null,
): Promise<SingleResult<T>> {
	try {
		const data = await fetchAniListGraphQL(query, variables, tag);
		const item = extractFn(data);
		return {
			data: item,
			error: { isError: false, message: "", errMsg: null },
		};
	} catch (e: any) {
		console.error(`Failed to fetch ${tag}:`, e);
		return {
			data: null,
			error: {
				isError: true,
				message: e?.message || `Failed to fetch ${tag}`,
				errMsg: e,
			},
		};
	}
}

const TOP_ANIME_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: [SCORE_DESC]) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
        medium
      }
      type
      format
      status
      episodes
      duration
      season
      seasonYear
      averageScore
      meanScore
      popularity
      favourites
      genres
    }
  }
}
`;

const TOP_MANGA_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: MANGA, sort: [SCORE_DESC]) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
        medium
      }
      type
      format
      status
      chapters
      volumes
      averageScore
      meanScore
      popularity
      favourites
      genres
    }
  }
}
`;

const TOP_STAFF_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    staff(sort: [FAVOURITES_DESC]) {
      id
      name {
        full
        native
        alternative
      }
      image {
        large
        medium
      }
      favourites
      primaryOccupations
    }
  }
}
`;

const TOP_CHARACTER_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    characters(sort: [FAVOURITES_DESC]) {
      id
      name {
        full
        native
        alternative
      }
      image {
        large
        medium
      }
      favourites
    }
  }
}
`;

const ANIME_BY_ID_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
      medium
    }
    type
    format
    status
    episodes
    duration
    season
    seasonYear
    averageScore
    meanScore
    popularity
    favourites
    genres
    studios {
      nodes {
        name
      }
    }
    source
    description
    bannerImage
    rankings {
      rank
      type
      allTime
    }
    siteUrl
  }
}
`;

const MANGA_BY_ID_QUERY = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
      medium
    }
    type
    format
    status
    chapters
    volumes
    averageScore
    meanScore
    popularity
    favourites
    genres
    source
    description
    bannerImage
    rankings {
      rank
      type
      allTime
    }
    siteUrl
    staff {
      edges {
        role
        node {
          id
          name {
            full
          }
        }
      }
    }
  }
}
`;

const CHARACTER_BY_ID_QUERY = `
query ($id: Int) {
  Character(id: $id) {
    id
    name {
      full
      native
      alternative
    }
    image {
      large
      medium
    }
    favourites
    description
    siteUrl
    media(page: 1, perPage: 25) {
      nodes {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        type
      }
    }
  }
}
`;

const STAFF_BY_ID_QUERY = `
query ($id: Int) {
  Staff(id: $id) {
    id
    name {
      full
      native
      alternative
    }
    image {
      large
      medium
    }
    favourites
    description
    primaryOccupations
    dateOfBirth {
      year
      month
      day
    }
    homeTown
    siteUrl
    staffMedia(page: 1, perPage: 25) {
      nodes {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        type
      }
    }
    characters(page: 1, perPage: 25) {
      nodes {
        id
        name {
          full
        }
        image {
          large
          medium
        }
      }
    }
  }
}
`;

export async function getTopAnime(): Promise<Result<AniListMedia>> {
	return fetchAniListList<AniListMedia>(
		TOP_ANIME_QUERY,
		{ page: 1, perPage: 25 },
		"top-anime",
		(d) => d?.Page?.media || [],
	);
}

export async function getTopManga(): Promise<Result<AniListMedia>> {
	return fetchAniListList<AniListMedia>(
		TOP_MANGA_QUERY,
		{ page: 1, perPage: 25 },
		"top-manga",
		(d) => d?.Page?.media || [],
	);
}

export async function getTopStaff(): Promise<Result<AniListStaff>> {
	return fetchAniListList<AniListStaff>(
		TOP_STAFF_QUERY,
		{ page: 1, perPage: 25 },
		"top-staff",
		(d) => d?.Page?.staff || [],
	);
}

export async function getTopCharacter(): Promise<Result<AniListCharacter>> {
	return fetchAniListList<AniListCharacter>(
		TOP_CHARACTER_QUERY,
		{ page: 1, perPage: 25 },
		"top-character",
		(d) => d?.Page?.characters || [],
	);
}

export async function getAnimeById(id: number): Promise<SingleResult<AniListMedia>> {
	return fetchAniListSingleItem<AniListMedia>(
		ANIME_BY_ID_QUERY,
		{ id },
		`anime-${id}`,
		(d) => d?.Media || null,
	);
}

export async function getMangaById(id: number): Promise<SingleResult<AniListMedia>> {
	return fetchAniListSingleItem<AniListMedia>(
		MANGA_BY_ID_QUERY,
		{ id },
		`manga-${id}`,
		(d) => d?.Media || null,
	);
}

export async function getCharacterById(id: number): Promise<SingleResult<AniListCharacter>> {
	return fetchAniListSingleItem<AniListCharacter>(
		CHARACTER_BY_ID_QUERY,
		{ id },
		`character-${id}`,
		(d) => d?.Character || null,
	);
}

export async function getStaffById(id: number): Promise<SingleResult<AniListStaff>> {
	return fetchAniListSingleItem<AniListStaff>(
		STAFF_BY_ID_QUERY,
		{ id },
		`staff-${id}`,
		(d) => d?.Staff || null,
	);
}
