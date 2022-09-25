import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Week } from '../../model/Games';
import { Path } from '../../model/Paths';
import { SurvivorContext } from '../../SurvivorContext';
import { generatePaths } from '../../utilities/generatePaths';
import { FileInput } from '../FileInput';

export const Input: React.FC = () => {
	const { updateError, updatePaths } = useContext(SurvivorContext);
	const [data, setData] = useState<Week[] | null>(null);

	const navigate = useNavigate();

	const handleFileParse = (fileData: Week[]): void => {
		setData(fileData);
	};

	const handleSubmit = (): void => {
		if (data !== null) {
			try {
				updatePaths([]);
				const newPaths: Path[] = generatePaths({ weeks: data });
				newPaths.sort(
					(pathA, pathB) => pathB.aggregateOdds - pathA.aggregateOdds
				);
				updatePaths(newPaths);

				navigate('/output');
			} catch (e) {
				if (e instanceof RangeError) {
					updateError('The input is too large to generate paths');
				} else if (e instanceof Error) {
					updateError(`An error occurred: : ${e.message}`);
				} else {
					updateError('Something went wrong');
				}
			}
		} else {
			updateError('Unable to generate paths, the data is missing');
		}
	};

	return (
		<>
			<FileInput
				onFileChange={() => {
					updateError(null);
					setData(null);
				}}
				onSubmit={handleFileParse}
			/>

			{data !== null && <button onClick={handleSubmit}>Generate Paths</button>}
		</>
	);
};
