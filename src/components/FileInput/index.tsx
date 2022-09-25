import React, { useState } from 'react';
import { Game, Week } from '../../model/Games';
import './index.css';

interface InputProps {
	onFileChange: () => void;
	onSubmit: (data: Week[]) => void;
}

export const FileInput: React.FC<InputProps> = ({ onFileChange, onSubmit }) => {
	const [fileError, setFileError] = useState<string | null>(null);
	const [fileText, setFileText] = useState<string | null>(null);

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
			setFileError(`Unable to parse the file data: the file's data is missing`);
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
				setFileError('The input file must be a csv file');
			}
		}

		reader.onload = async (progressEvent) => {
			if (progressEvent.target !== null) {
				const text: string | ArrayBuffer | null = progressEvent.target.result;
				if (typeof text === 'string') {
					setFileText(text);
				} else {
					setFileError('An error occurred while reading the file');
				}
			}
		};
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();

		const data: Week[] = parseFileText();
		if (data.length === 0) {
			setFileError('No odds or games data was found in the file');
		} else {
			onSubmit(data);
		}
	};

	return (
		<>
			<p>Input a CSV file with the Vegas odds</p>

			{fileError !== null && <p className="error-text">{fileError}</p>}

			<form onSubmit={handleSubmit} className="file-input-form">
				<input
					className="file-input"
					id="file"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setFileError(null);
						readFile(event);
						onFileChange();
					}}
					required
					type="file"
				/>
				<br />
				<button type="submit" disabled={fileText === null}>
					Read File
				</button>
			</form>
		</>
	);
};
