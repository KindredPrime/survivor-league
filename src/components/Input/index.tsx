import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Week } from '../../model/Games';
import { Path } from '../../model/Paths';
import { SurvivorContext } from '../../SurvivorContext';
import { generatePaths } from '../../utilities/generatePaths';
import { FileInput } from '../FileInput';

export const Input: React.FC = () => {
	const { updateError, updatePaths } = useContext(SurvivorContext);

	const navigate = useNavigate();

	const handleSubmit = (weeks: Week[]): void => {
		try {
			updatePaths([]);
			const newPaths: Path[] = generatePaths({ weeks });
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
	};

	return (
		<FileInput
			onFileChange={() => {
				updateError(null);
			}}
			onSubmit={handleSubmit}
		/>
	);
};
