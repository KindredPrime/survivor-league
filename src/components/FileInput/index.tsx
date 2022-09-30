import React, { useEffect, useState } from 'react';
import { Game, Week } from '../../model/Games';
import './index.css';

interface InputProps {
	onFailure: (error: string) => void;
	onFileChange: () => void;
	onSuccess: (weeks: Week[], teams: string[]) => void;
}

export const FileInput: React.FC<InputProps> = ({
	onFailure,
	onFileChange,
	onSuccess,
}) => {
	const [fileText, setFileText] = useState<string | null>(null);

	useEffect(() => {
		if (fileText !== null) {
			const data: Week[] = parseFileText();
			if (data.length === 0) {
				onFailure('No odds or games data were found in the file');
			} else {
				const teams: string[] = getTeams(data);
				onSuccess(data, teams);
			}
		}
	}, [fileText]);

	const parseFileText = (): Week[] => {
		const weeks: Week[] = [];

		if (fileText !== null) {
			const rawGames: string[] = fileText.split('\r\n').slice(1, -1);
			let weekIndex = -1;
			rawGames.forEach((rawGame) => {
				const gameDataParts: string[] = rawGame.split(',');
				const gameNumber = parseInt(gameDataParts[0], 10);
				const teamA = gameDataParts[1];
				const teamB = gameDataParts[2];
				const odds = parseInt(gameDataParts[4], 10) / 100;

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
		} else {
			onFailure(`Unable to parse the file data: the file's data is missing`);
		}

		return weeks;
	};

	const readFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
		event.preventDefault();

		setFileText(null);

		const reader = new FileReader();

		const newFile: File | null | undefined = event.target.files?.item(0);
		if (newFile !== null && newFile !== undefined) {
			const fileTypeExtension = newFile.type.split('/')[1];
			const fileNameParts = newFile.name.split('.');
			const fileNameExtension = fileNameParts[fileNameParts.length - 1];
			if (
				fileTypeExtension === 'csv' ||
				fileNameExtension === 'csv' ||
				newFile.type.includes('ms-excel')
			) {
				reader.readAsText(newFile);
			} else {
				onFailure('The input file must be a csv file');
			}
		}

		reader.onload = async (progressEvent) => {
			if (progressEvent.target !== null) {
				const text: string | ArrayBuffer | null = progressEvent.target.result;
				if (typeof text === 'string') {
					setFileText(text);
				} else {
					onFailure('An error occurred while reading the file');
				}
			}
		};
	};

	const getTeams = (weeks: Week[]): string[] => {
		const allTeams = new Set<string>();

		weeks.forEach((week) => {
			week.forEach((game) => {
				const { teamA, teamB } = game;

				if (!allTeams.has(teamA)) {
					allTeams.add(teamA);
				}

				if (!allTeams.has(teamB)) {
					allTeams.add(teamB);
				}
			});
		});

		const orderedTeams: string[] = Array.from(allTeams);
		orderedTeams.sort();

		return orderedTeams;
	};

	return (
		<>
			<p className="instructions">Input a CSV file with the Vegas odds</p>

			<input
				className="file-input"
				id="file"
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					onFileChange();
					readFile(event);
				}}
				required
				type="file"
			/>
		</>
	);
};
