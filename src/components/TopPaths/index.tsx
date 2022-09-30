import React from 'react';
import { Path } from '../../model/Paths';
import './index.css';

interface OutputProps {
	paths: Path[];
}

export const TopPaths: React.FC<OutputProps> = ({ paths }) => {
	const renderPaths = (): JSX.Element => {
		return (
			<div>
				<p className="format">Format - {`<path of teams>: <aggregate odds>`}</p>

				<ol className="paths-list">
					{paths.slice(0, 10).map((path) => {
						const { id, aggregateOdds, winningTeams } = path;
						return (
							<li key={id} className="path">{`${winningTeams.join(
								', '
							)}: ${aggregateOdds}`}</li>
						);
					})}
				</ol>
			</div>
		);
	};
	return (
		<div className="TopPaths">
			<h2 className="title">Top 10 Paths</h2>

			{paths.length > 0 ? renderPaths() : <p>No paths were generated</p>}
		</div>
	);
};
