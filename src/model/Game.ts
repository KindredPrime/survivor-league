export interface Game {
	teamA: string;
	teamB: string;
	// Chance that Team A wins
	odds: number;
}

export type Week = Game[];
