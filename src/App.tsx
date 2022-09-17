import React from 'react';
import './App.css';
import { FileInput } from './components/FileInput';
import { Game, Week } from './model/Game';

const App: React.FC = () => {
	const parseData = (data: string): Week[] => {
		const weeks: Week[] = [];

		const rawGames: string[] = data.split('\r\n').slice(1, -1);
		let weekIndex = -1;
		rawGames.forEach((rawGame) => {
			const gameDataParts: string[] = rawGame.split(',');
			const gameNumber = parseInt(gameDataParts[0], 10);
			const teamA = gameDataParts[1];
			const teamB = gameDataParts[2];
			const odds = parseInt(gameDataParts[4], 10);

			const game: Game = {
				teamA,
				teamB,
				odds,
			};

			if (gameNumber === 1) {
				weekIndex++;

				const week: Week = [game];
				weeks.push(week);
			} else {
				const currentWeek: Week = weeks[weekIndex];
				weeks[weekIndex] = [...currentWeek, game];
			}
		});

		return weeks;
	};

	const generatePaths = (data: string): void => {
		const weeks: Week[] = parseData(data);
		console.log(weeks);
	};

	return (
		<div className="App">
			<header>
				<h1>Survivor League</h1>
			</header>

			<FileInput onSubmit={generatePaths} />
		</div>
	);
};

export default App;
