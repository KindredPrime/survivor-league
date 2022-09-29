import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Week } from '../../model/Games';
import { Path } from '../../model/Paths';
import { SurvivorContext } from '../../SurvivorContext';
import { generatePaths } from '../../utilities/generatePaths';
import { FileInput } from '../FileInput';

export const Input: React.FC = () => {
	const { updateError, updatePaths } = useContext(SurvivorContext);
	const [weeks, setWeeks] = useState<Week[] | null>(null);
	const [allTeams, setAllTeams] = useState<string[]>([]);
	const [previousTeams, setPreviousTeams] = useState<string[]>([]);

	const navigate = useNavigate();

	const handleFileParse = (fileWeeks: Week[], fileTeams: string[]): void => {
		setWeeks(fileWeeks);
		setAllTeams(fileTeams);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();

		if (weeks !== null) {
			try {
				updatePaths([]);
				console.log('Previous Teams: ');
				console.log(previousTeams);
				const newPaths: Path[] = generatePaths({
					previouslySelectedTeams: previousTeams,
					weeks,
				});
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

	const handleTeamCheck = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		const newTeam = event.target.value;
		const newPreviousTeams: string[] = [...previousTeams];

		if (event.target.checked) {
			newPreviousTeams.push(newTeam);
		} else if (!event.target.checked && previousTeams.includes(newTeam)) {
			newPreviousTeams.splice(previousTeams.indexOf(newTeam), 1);
		}

		setPreviousTeams(newPreviousTeams);
	};

	return (
		<>
			<FileInput
				onFileChange={() => {
					updateError(null);
					setWeeks(null);
				}}
				onSubmit={handleFileParse}
			/>

			{weeks !== null && (
				<form onSubmit={(e) => handleSubmit(e)}>
					<p>Which of these teams have you selected in previous weeks?</p>

					{allTeams.map((team) => {
						const id = `${team}-checkbox`;
						return (
							<div key={team}>
								<input
									id={id}
									type="checkbox"
									value={team}
									onChange={handleTeamCheck}
								/>
								<label htmlFor={id}>{team}</label>
							</div>
						);
					})}

					<br />

					<button type="submit" disabled={weeks === null}>
						Generate Paths
					</button>
				</form>
			)}
		</>
	);
};
