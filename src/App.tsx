import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import './App.css';
import { FileInput } from './components/FileInput';
import { PathsOutput } from './components/PathsOutput';
import { Game, Week } from './model/Games';
import { Path } from './model/Paths';

interface GeneratePathsParams {
	weeks: Week[];
	currentPath?: Path;
	generatedPaths?: Path[];
	gameIndex?: number;
	weekIndex?: number;
}

const App: React.FC = () => {
	const [allPaths, setAllPaths] = useState<Path[]>([]);
	const [showPaths, setShowPaths] = useState(false);

	useEffect(() => {
		console.log('All Paths:');
		console.log(allPaths);
	}, [allPaths]);

	const gameIsValidToAddToPath = (game: Game, path: Path): boolean => {
		return !path.winningTeams.includes(game.teamA);
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

	/*
    Implement sorting later
  */
	const generatePaths = ({
		weeks,
		currentPath,
		generatedPaths = [],
		gameIndex = 0,
		weekIndex = 0,
	}: GeneratePathsParams): Path[] => {
		if (weekIndex === weeks.length - 1) {
			const currentGame: Game = weeks[weekIndex][gameIndex];
			const { odds, winner } = getWinnerAndOdds(currentGame);

			if (currentPath === undefined) {
				const newPath: Path = {
					id: uuid(),
					aggregateOdds: odds,
					winningTeams: [winner],
				};

				// Sort here
				const newPaths: Path[] = [...generatedPaths, newPath];

				if (gameIndex === weeks[weekIndex].length - 1) {
					return newPaths;
				} else {
					return generatePaths({
						weeks,
						currentPath,
						generatedPaths: newPaths,
						gameIndex: gameIndex + 1,
						weekIndex,
					});
				}
			} else {
				if (gameIsValidToAddToPath(currentGame, currentPath)) {
					const newPath: Path = {
						id: uuid(),
						aggregateOdds: currentPath.aggregateOdds * odds,
						winningTeams: [...currentPath.winningTeams, winner],
					};

					// Sort here
					const newPaths: Path[] = [...generatedPaths, newPath];

					if (gameIndex === weeks[weekIndex].length - 1) {
						return newPaths;
					} else {
						return generatePaths({
							weeks,
							currentPath,
							generatedPaths: newPaths,
							gameIndex: gameIndex + 1,
							weekIndex,
						});
					}
				} else {
					if (gameIndex < weeks[weekIndex].length - 1) {
						// Skip to the next game
						return generatePaths({
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
		}

		if (weekIndex < weeks.length - 1) {
			const newPaths: Path[] = [];
			for (let j = gameIndex; j < weeks[weekIndex].length; j++) {
				const currentGame: Game = weeks[weekIndex][j];
				const { odds, winner } = getWinnerAndOdds(currentGame);

				if (currentPath === undefined) {
					const newPath: Path = {
						id: uuid(),
						aggregateOdds: odds,
						winningTeams: [winner],
					};

					newPaths.push(
						...generatePaths({
							weeks,
							currentPath: newPath,
							generatedPaths,
							weekIndex: weekIndex + 1,
						})
					);
				} else {
					if (gameIsValidToAddToPath(currentGame, currentPath)) {
						const newPath: Path = {
							id: uuid(),
							aggregateOdds: currentPath.aggregateOdds * odds,
							winningTeams: [...currentPath.winningTeams, winner],
						};

						newPaths.push(
							...generatePaths({
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
			}

			return newPaths;
		}

		return generatedPaths;
	};

	return (
		<div className="App">
			<header>
				<h1>Survivor League</h1>
			</header>

			{showPaths && (
				<div className="Top-paths-wrapper">
					<PathsOutput paths={allPaths} />
				</div>
			)}

			{/* Hide this after clicking "Generate Paths"? */}
			<FileInput
				onSubmit={(weeks) => {
					const newPaths: Path[] = generatePaths({ weeks });
					setAllPaths(newPaths);
					setShowPaths(true);
				}}
				pathsAreShown={showPaths}
			/>
		</div>
	);
};

export default App;
