import React, { useState } from 'react';
import { Game, Week } from '../../model/Games';
import './index.css';

interface InputProps {
	onFileChange: () => void;
	onSubmit: (data: Week[]) => void;
	pathsAreShown: boolean;
}

export const FileInput: React.FC<InputProps> = ({
	onFileChange,
	onSubmit,
	pathsAreShown,
}) => {
	const [data, setData] = useState<Week[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	const parseData = (data: string): Week[] => {
		const weeks: Week[] = [];

		const rawGames: string[] = data.split('\r\n').slice(1, -1);
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

		return weeks;
	};

	const readFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
		event.preventDefault();

		setData(null);

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
				setError(null);

				reader.readAsText(newFile);
			} else {
				setError('The input file must be a csv file');
			}
		}

		reader.onload = async (progressEvent) => {
			if (progressEvent.target !== null) {
				const text: string | ArrayBuffer | null = progressEvent.target.result;
				if (typeof text === 'string') {
					const fileData = parseData(text);
					setData(fileData);
				} else {
					setError('An error occurred while reading the file');
				}
			}
		};
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();

		if (data === null) {
			setError(`Unable to generate paths: the file's data is missing`);
		} else {
			onSubmit(data);
		}
	};

	return (
		<>
			<p>
				{pathsAreShown
					? 'Input a new CSV file with Vegas odds to generate new output'
					: 'Input a CSV file with the Vegas odds'}
			</p>

			{error !== null && <p className="error-text">{error}</p>}

			<form onSubmit={handleSubmit} className="file-input-form">
				<input
					className="file-input"
					id="file"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						readFile(event);
						onFileChange();
					}}
					required
					type="file"
				/>
				<br />
				<button type="submit" disabled={data === null}>
					Generate paths
				</button>
			</form>
		</>
	);
};
