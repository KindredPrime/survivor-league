import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileInput } from '../FileInput';

export const Input: React.FC = () => {
	const navigate = useNavigate();

	return (
		<FileInput
			onFileChange={() => {
				/*
          setError(null)
        */
			}}
			onSubmit={(weeks) => {
				/*
				try {
					setAllPaths([]);
					setShowPaths(false);
					const newPaths: Path[] = generatePaths({ weeks });
					newPaths.sort(
						(pathA, pathB) => pathB.aggregateOdds - pathA.aggregateOdds
					);
					setAllPaths(newPaths);
					setShowPaths(true);
				} catch (e) {
					if (e instanceof RangeError) {
						setError('The input is too large to generate paths');
					} else if (e instanceof Error) {
						setError(`An error occurred: : ${e.message}`);
					} else {
						setError('Something went wrong');
					}
				}
        */

				return navigate('/output');
			}}
		/>
	);
};
