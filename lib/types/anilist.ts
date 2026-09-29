export type AniListTitle = {
	romaji?: string | null;
	english?: string | null;
	native?: string | null;
};

export type AniListCoverImage = {
	extraLarge?: string | null;
	large?: string | null;
	medium?: string | null;
};

export type AniListRanking = {
	rank: number;
	type: string;
	allTime?: boolean | null;
};

export type AniListStudio = {
	name: string;
};

export type AniListStaffEdge = {
	role: string;
	node: {
		id: number;
		name: {
			full: string;
		};
	};
};

export type AniListMedia = {
	id: number;
	title: AniListTitle;
	coverImage: AniListCoverImage;
	type: "ANIME" | "MANGA";
	format?: string | null;
	status?: string | null;
	episodes?: number | null;
	chapters?: number | null;
	volumes?: number | null;
	duration?: number | null;
	season?: string | null;
	seasonYear?: number | null;
	averageScore?: number | null;
	meanScore?: number | null;
	popularity?: number | null;
	favourites?: number | null;
	genres?: string[] | null;
	studios?: {
		nodes: AniListStudio[];
	} | null;
	source?: string | null;
	description?: string | null;
	bannerImage?: string | null;
	rankings?: AniListRanking[] | null;
	siteUrl?: string | null;
	staff?: {
		edges: AniListStaffEdge[];
	} | null;
};

export type AniListCharacterImage = {
	large?: string | null;
	medium?: string | null;
};

export type AniListCharacterName = {
	full?: string | null;
	native?: string | null;
	alternative?: string[] | null;
};

export type AniListMediaNode = {
	id: number;
	title: AniListTitle;
	coverImage?: AniListCoverImage | null;
	type: "ANIME" | "MANGA";
};

export type AniListCharacter = {
	id: number;
	name: AniListCharacterName;
	image: AniListCharacterImage;
	favourites?: number | null;
	description?: string | null;
	media?: {
		nodes: AniListMediaNode[];
	} | null;
	siteUrl?: string | null;
};

export type AniListDateOfBirth = {
	year?: number | null;
	month?: number | null;
	day?: number | null;
};

export type AniListCharacterNode = {
	id: number;
	name: {
		full: string;
	};
	image?: AniListCharacterImage | null;
};

export type AniListStaff = {
	id: number;
	name: AniListCharacterName;
	image: AniListCharacterImage;
	favourites?: number | null;
	description?: string | null;
	primaryOccupations?: string[] | null;
	dateOfBirth?: AniListDateOfBirth | null;
	homeTown?: string | null;
	staffMedia?: {
		nodes: AniListMediaNode[];
	} | null;
	characters?: {
		nodes: AniListCharacterNode[];
	} | null;
	siteUrl?: string | null;
};

export type AniListItem = AniListMedia | AniListCharacter | AniListStaff;

export type Result<T> = {
	data: T[];
	error: {
		isError: boolean;
		message: string;
		errMsg: unknown;
	};
};

export type SingleResult<T> = {
	data: T | null;
	error: {
		isError: boolean;
		message: string;
		errMsg: unknown;
	};
};
