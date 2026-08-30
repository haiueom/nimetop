import type {
	Anime,
	Manga,
	Character,
	CharacterFull,
	Person,
	PersonFull,
} from "@tutkli/jikan-ts";

export type { Anime, Manga, Character, CharacterFull, Person, PersonFull };

export type JikanItem = Anime | Manga | Character | Person;

export type JikanResult<T> = {
	data: T[];
	error: {
		isError: boolean;
		message: string;
		errMsg: unknown;
	};
};
