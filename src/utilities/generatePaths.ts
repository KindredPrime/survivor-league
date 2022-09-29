import { v4 as uuid } from 'uuid';
import { Game, Week } from '../model/Games';
import { Path } from '../model/Paths';

const teamIsValidToAddToPath = (team: string, path: Path): boolean => {
	return !path.winningTeams.includes(team);
};

const getWinnerAndOdds = (
	game: Game
): {
	odds: number;
	winner: string;
} => {
	const { odds: teamAOdds, teamA, teamB } = game;

	if (teamAOdds < 0.5) {
		return {
			odds: 1 - teamAOdds,
			winner: teamB,
		};
	} else {
		return {
			odds: teamAOdds,
			winner: teamA,
		};
	}
};

interface GeneratePathsParams {
	previouslySelectedTeams: string[];
	weeks: Week[];
	currentPath?: Path;
	generatedPaths?: Path[];
	gameIndex?: number;
	weekIndex?: number;
}

export const generatePaths = ({
	previouslySelectedTeams,
	weeks,
	currentPath,
	generatedPaths = [],
	gameIndex = 0,
	weekIndex = 0,
}: GeneratePathsParams): Path[] => {
	if (weekIndex === weeks.length - 1) {
		const currentGame: Game = weeks[weekIndex][gameIndex];
		const { odds, winner } = getWinnerAndOdds(currentGame);

		if (previouslySelectedTeams.includes(winner)) {
			if (gameIndex < weeks[weekIndex].length - 1) {
				// Skip to the next game
				return generatePaths({
					previouslySelectedTeams,
					weeks,
					currentPath,
					generatedPaths,
					gameIndex: gameIndex + 1,
					weekIndex,
				});
			} else {
				return generatedPaths;
			}
		} else if (currentPath === undefined) {
			const newPath: Path = {
				id: uuid(),
				aggregateOdds: odds,
				winningTeams: [winner],
			};

			const newPaths: Path[] = [...generatedPaths, newPath];

			if (gameIndex < weeks[weekIndex].length - 1) {
				return generatePaths({
					previouslySelectedTeams,
					weeks,
					currentPath,
					generatedPaths: newPaths,
					gameIndex: gameIndex + 1,
					weekIndex,
				});
			} else {
				return newPaths;
			}
		} else if (teamIsValidToAddToPath(winner, currentPath)) {
			const newPath: Path = {
				id: uuid(),
				aggregateOdds: currentPath.aggregateOdds * odds,
				winningTeams: [...currentPath.winningTeams, winner],
			};

			const newPaths: Path[] = [...generatedPaths, newPath];

			if (gameIndex < weeks[weekIndex].length - 1) {
				return generatePaths({
					previouslySelectedTeams,
					weeks,
					currentPath,
					generatedPaths: newPaths,
					gameIndex: gameIndex + 1,
					weekIndex,
				});
			} else {
				return newPaths;
			}
		} else {
			if (gameIndex < weeks[weekIndex].length - 1) {
				// Skip to the next game
				return generatePaths({
					previouslySelectedTeams,
					weeks,
					currentPath,
					generatedPaths,
					gameIndex: gameIndex + 1,
					weekIndex,
				});
			} else {
				return generatedPaths;
			}
		}
	}

	if (weekIndex < weeks.length - 1) {
		const newPaths: Path[] = [];

		for (let j = gameIndex; j < weeks[weekIndex].length; j++) {
			const currentGame: Game = weeks[weekIndex][j];
			const { odds, winner } = getWinnerAndOdds(currentGame);

			if (previouslySelectedTeams.includes(winner)) {
				continue;
			} else if (currentPath === undefined) {
				const newPath: Path = {
					id: uuid(),
					aggregateOdds: odds,
					winningTeams: [winner],
				};

				newPaths.push(
					...generatePaths({
						previouslySelectedTeams,
						weeks,
						currentPath: newPath,
						generatedPaths,
						weekIndex: weekIndex + 1,
					})
				);
			} else if (teamIsValidToAddToPath(winner, currentPath)) {
				const newPath: Path = {
					id: uuid(),
					aggregateOdds: currentPath.aggregateOdds * odds,
					winningTeams: [...currentPath.winningTeams, winner],
				};

				newPaths.push(
					...generatePaths({
						previouslySelectedTeams,
						weeks,
						currentPath: newPath,
						generatedPaths,
						weekIndex: weekIndex + 1,
					})
				);
			} else {
				continue;
			}
		}

		return newPaths;
	}

	return generatedPaths;
};
