"use server";

import fs from "fs";
import path from "path";

export async function getBannerImages() {
	const imagesDirectory = path.join(process.cwd(), "public/img/banner");
	const filenames = fs.readdirSync(imagesDirectory);

	const images = filenames.map((filename) => ({
		src: `/img/banner/${filename}`,
		alt: `banner ${filename.replace(/\.[^/.]+$/, "")}`,
	}));

	return images;
}

const valid = 600;

export async function getTopAnime() {
	let error = false;
	try {
		const res = await fetch("https://api.jikan.moe/v4/top/anime", {
			next: {
				revalidate: valid,
				tags: ["top-anime"],
			},
		});
		const data = await res.json();
		if (!data.data && data.status) {
			error = true;
		}
		return {
			data: error
				? {}
				: data.data.sort((a: any, b: any) => a.rank - b.rank),
			error: {
				isError: error,
				message: error ? "Failed to fetch top anime" : "",
				errMsg: error ? data : {},
			},
		};
	} catch (e) {
		console.error("Error fetching top anime:", e);
		throw e;
	}
}

export async function getTopManga() {
	let error = false;
	try {
		const res = await fetch("https://api.jikan.moe/v4/top/manga", {
			next: {
				revalidate: valid,
				tags: ["top-manga"],
			},
		});
		const data = await res.json();
		if (!data.data && data.status) {
			error = true;
		}
		return {
			data: error
				? {}
				: data.data.sort((a: any, b: any) => a.rank - b.rank),
			error: {
				isError: error,
				message: error ? "Failed to fetch top manga" : "",
				errMsg: error ? data : {},
			},
		};
	} catch (e) {
		console.error("Error fetching top manga:", e);
		throw e;
	}
}

export async function getTopPeople() {
	let error = false;
	try {
		const res = await fetch("https://api.jikan.moe/v4/top/people", {
			next: {
				revalidate: valid,
				tags: ["top-people"],
			},
		});
		const data = await res.json();
		if (!data.data && data.status) {
			error = true;
		}
		return {
			data: error
				? {}
				: data.data.sort((a: any, b: any) => b.favorites - a.favorites),
			error: {
				isError: error,
				message: error ? "Failed to fetch top people" : "",
				errMsg: error ? data : {},
			},
		};
	} catch (e) {
		console.error("Error fetching top people:", e);
		throw e;
	}
}

export async function getTopCharacter() {
	let error = false;
	try {
		const res = await fetch("https://api.jikan.moe/v4/top/characters", {
			next: {
				revalidate: valid,
				tags: ["top-character"],
			},
		});
		const data = await res.json();
		if (!data.data && data.status) {
			error = true;
		}
		return {
			data: error
				? {}
				: data.data.sort((a: any, b: any) => b.favorites - a.favorites),
			error: {
				isError: error,
				message: error ? "Failed to fetch top character" : "",
				errMsg: error ? data : {},
			},
		};
	} catch (e) {
		console.error("Error fetching top character:", e);
		throw e;
	}
}
