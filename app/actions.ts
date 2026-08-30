"use server";

import fs from "fs";
import path from "path";
import type { Anime, Manga, Character, CharacterFull, Person, PersonFull } from "@tutkli/jikan-ts";

export async function getBannerImages() {
	const imagesDirectory = path.join(process.cwd(), "public/img/banner");
	const filenames = fs.readdirSync(imagesDirectory);
	return filenames.map((filename) => ({
		src: `/img/banner/${filename}`,
		alt: `banner ${filename.replace(/\.[^/.]+$/, "")}`,
	}));
}

const JIKAN_BASE = "https://api.jikan.moe/v4";
const TIMEOUT_MS = 10_000;
const RETRIES = 3;
const MIN_INTERVAL_MS = 400;

const queue: (() => void)[] = [];
let lastRequestTime = 0;
let running = false;

function drain() {
	if (running) return;
	running = true;
	const tick = async () => {
		while (queue.length > 0) {
			const now = Date.now();
			const wait = MIN_INTERVAL_MS - (now - lastRequestTime);
			if (wait > 0) await new Promise((r) => setTimeout(r, wait));
			lastRequestTime = Date.now();
			queue.shift()!();
		}
		running = false;
	};
	void tick();
}

function acquireSlot(): Promise<void> {
	return new Promise((resolve) => {
		queue.push(resolve);
		drain();
	});
}

type Result<T> = {
	data: T[];
	error: { isError: boolean; message: string; errMsg: unknown };
};

type SingleResult<T> = {
	data: T | null;
	error: { isError: boolean; message: string; errMsg: unknown };
};

async function fetchJikan<T>(
	endpoint: string,
	tag: string,
	sortFn: (a: T, b: T) => number,
): Promise<Result<T>> {
	const err = (msg: string, raw: unknown): Result<T> => ({
		data: [] as T[],
		error: { isError: true, message: msg, errMsg: raw },
	});

	for (let attempt = 0; attempt < RETRIES; attempt++) {
		await acquireSlot();
		try {
			const res = await fetch(`${JIKAN_BASE}/${endpoint}`, {
				signal: AbortSignal.timeout(TIMEOUT_MS),
				next: { revalidate: 600, tags: [tag] },
			});
			if (res.status === 429) {
				const retryAfter = Number(res.headers.get("retry-after")) || 2;
				await new Promise((r) => setTimeout(r, retryAfter * 1000));
				continue;
			}
			const json = await res.json();
			if (!json.data) {
				const msg = `Failed to fetch ${tag} (status: ${json.status ?? res.status})`;
				if (attempt < RETRIES - 1) {
					await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
					continue;
				}
				return err(msg, json);
			}
			return {
				data: (json.data as T[]).slice().sort(sortFn),
				error: { isError: false, message: "", errMsg: null },
			};
		} catch (e) {
			if (attempt < RETRIES - 1) {
				await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
				continue;
			}
			console.error(`Failed to fetch ${tag} after ${RETRIES} attempts:`, e);
			return err(`Failed to fetch ${tag}`, e);
		}
	}

	return err(`Failed to fetch ${tag}`, null);
}

async function fetchJikanSingle<T>(
	endpoint: string,
	tag: string,
): Promise<SingleResult<T>> {
	const err = (msg: string, raw: unknown): SingleResult<T> => ({
		data: null,
		error: { isError: true, message: msg, errMsg: raw },
	});

	for (let attempt = 0; attempt < RETRIES; attempt++) {
		await acquireSlot();
		try {
			const res = await fetch(`${JIKAN_BASE}/${endpoint}`, {
				signal: AbortSignal.timeout(TIMEOUT_MS),
				next: { revalidate: 600, tags: [tag] },
			});
			if (res.status === 429) {
				const retryAfter = Number(res.headers.get("retry-after")) || 2;
				await new Promise((r) => setTimeout(r, retryAfter * 1000));
				continue;
			}
			const json = await res.json();
			if (!json.data) {
				const msg = `Failed to fetch ${tag} (status: ${json.status ?? res.status})`;
				if (attempt < RETRIES - 1) {
					await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
					continue;
				}
				return err(msg, json);
			}
			return {
				data: json.data as T,
				error: { isError: false, message: "", errMsg: null },
			};
		} catch (e) {
			if (attempt < RETRIES - 1) {
				await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
				continue;
			}
			console.error(`Failed to fetch ${tag} after ${RETRIES} attempts:`, e);
			return err(`Failed to fetch ${tag}`, e);
		}
	}

	return err(`Failed to fetch ${tag}`, null);
}

export async function getTopAnime(): Promise<Result<Anime>> {
	return fetchJikan<Anime>("top/anime", "top-anime", (a, b) => (a.rank ?? 0) - (b.rank ?? 0));
}

export async function getTopManga(): Promise<Result<Manga>> {
	return fetchJikan<Manga>("top/manga", "top-manga", (a, b) => (a.rank ?? 0) - (b.rank ?? 0));
}

export async function getTopPeople(): Promise<Result<Person>> {
	return fetchJikan<Person>("top/people", "top-people", (a, b) => b.favorites - a.favorites);
}

export async function getTopCharacter(): Promise<Result<Character>> {
	return fetchJikan<Character>("top/characters", "top-character", (a, b) => b.favorites - a.favorites);
}

export async function getAnimeById(id: number): Promise<SingleResult<Anime>> {
	return fetchJikanSingle<Anime>(`anime/${id}`, `anime-${id}`);
}

export async function getMangaById(id: number): Promise<SingleResult<Manga>> {
	return fetchJikanSingle<Manga>(`manga/${id}`, `manga-${id}`);
}

export async function getPersonById(id: number): Promise<SingleResult<PersonFull>> {
	return fetchJikanSingle<PersonFull>(`people/${id}/full`, `person-${id}`);
}

export async function getCharacterById(id: number): Promise<SingleResult<CharacterFull>> {
	return fetchJikanSingle<CharacterFull>(`characters/${id}/full`, `character-${id}`);
}
