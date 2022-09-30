import { chunk } from 'lodash';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Week } from '../../model/Games';
import { Path } from '../../model/Paths';
import { SurvivorContext } from '../../SurvivorContext';
import { generatePaths } from '../../utilities/generatePaths';
import { FileInput } from '../FileInput';
import './index.css';

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

	const renderPreviousTeamInput = (team: string): JSX.Element => {
		const id = `${team}-checkbox`;

		return (
			<div className="previous-team" key={team}>
				<input
					id={id}
					type="checkbox"
					value={team}
					onChange={handleTeamCheck}
				/>
				<label htmlFor={id}>{team}</label>
			</div>
		);
	};

	const renderPreviousTeamsInputs = (): JSX.Element => {
		const teamsGroups: string[][] = chunk(allTeams, 8);

		return (
			<div className="teams-inputs-container">
				{teamsGroups.map((teamGroup, index) => (
					<div className="teams-column" key={`Team Group ${index + 1}`}>
						{teamGroup.map(renderPreviousTeamInput)}
					</div>
				))}
			</div>
		);
	};

	return (
		<form className="Input" onSubmit={handleSubmit}>
			<div className="file-input-container">
				<FileInput
					onFailure={(error: string) => {
						updateError(error);
					}}
					onFileChange={() => {
						updateError(null);
						setWeeks(null);
					}}
					onSuccess={handleFileParse}
				/>
			</div>

			{weeks !== null && (
				<>
					<p className="previous-teams-text">
						Which of these teams have you selected in previous weeks?
					</p>

					{renderPreviousTeamsInputs()}
				</>
			)}

			<button type="submit" disabled={weeks === null}>
				Generate Paths
			</button>
		</form>
	);
};
