import React, { useState } from 'react';
import './index.css';

interface InputProps {
	onSubmit: (data: string) => void;
}

export const FileInput: React.FC<InputProps> = ({ onSubmit }) => {
	const [data, setData] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	const readFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
		event.preventDefault();

		setFile(null);

		const reader = new FileReader();

		const newFiles: FileList | null = event.target.files;
		if (newFiles !== null) {
			const newFile: File | null = newFiles.item(0);

			if (newFile !== null) {
				const fileExtension = newFile.type.split('/')[1];
				if (fileExtension === 'csv') {
					setError(null);
					setFile(newFile);

					reader.readAsText(newFile);
				} else {
					setError('The input file must be a csv file');
				}
			} else {
				setError('No file was found in the input');
			}
		} else {
			setError('A file must be selected');
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
			{error !== null && <p>{error}</p>}

			<form onSubmit={handleSubmit}>
				<div className="input-wrapper">
					<label htmlFor="file">
						Please input a CSV file with the Vegas odds
					</label>
					<input
						id="file"
						onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
							readFile(event)
						}
						required
						type="file"
					/>
					<button type="submit" disabled={file === null}>
						Generate paths
					</button>
				</div>
			</form>
		</>
	);
};
