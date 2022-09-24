import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SurvivorContext } from '../../SurvivorContext';
import { PathsOutput } from '../PathsOutput';
import './index.css';

export const Output: React.FC = () => {
	const { allPaths } = useContext(SurvivorContext);

	return (
		<div className="Output">
			<h2 className="Title">Top 10 Paths</h2>

			<p className="Format">Format - {`<path of teams>: <aggregate odds>`}</p>

			<PathsOutput paths={allPaths} />

			<Link to="/input">Enter another set of input</Link>
		</div>
	);
};
