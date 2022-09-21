import React from 'react';
import { Path } from '../../model/Paths';
import './index.css';

interface OutputProps {
	paths: Path[];
}

export const PathsOutput: React.FC<OutputProps> = ({ paths }) => {
	return (
		<>
			<h2 className="Title">Top 10 Paths</h2>

			<ol>
				{paths.slice(0, 10).map((path) => {
					const { id, aggregateOdds, winningTeams } = path;
					return (
						<li key={id}>{`${winningTeams.join(', ')}: ${aggregateOdds}`}</li>
					);
				})}
			</ol>
		</>
	);
};