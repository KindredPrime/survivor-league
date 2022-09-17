import React, { useState } from 'react';
import './index.css';

interface InputProps {
	onSubmit: (data: string) => void;
}

export const FileInput: React.FC<InputProps> = ({ onSubmit }) => {
	const [data, setData] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const readFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
		event.preventDefault();

		setData(null);

		const reader = new FileReader();

		const newFile: File | null | undefined = event.target.files?.item(0);
		if (newFile !== null && newFile !== undefined) {
			const fileExtension = newFile.type.split('/')[1];
			if (fileExtension === 'csv') {
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
					setData(text);
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
			<h2 className="title">Input a CSV file with the Vegas odds</h2>

			{error !== null && <p className="error-text">{error}</p>}

			<form onSubmit={handleSubmit} className="file-input-form">
				<input
					className="file-input"
					id="file"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
						readFile(event)
					}
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
