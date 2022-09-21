import React from 'react';
import { Path } from '../../model/Paths';
import './index.css';

interface OutputProps {
	paths: Path[];
}

export const PathsOutput: React.FC<OutputProps> = ({ paths }) => {
	return (
		<div className="PathsOutput">
			<h2 className="Title">Top 10 Paths</h2>

			<p className="Format">Format - {`<path of teams>: <aggregate odds>`}</p>

			<ol>
				{paths.slice(0, 10).map((path) => {
					const { id, aggregateOdds, winningTeams } = path;
					return (
						<li key={id} className="Path">{`${winningTeams.join(
							', '
						)}: ${aggregateOdds}`}</li>
					);
				})}
			</ol>
		</div>
	);
};
