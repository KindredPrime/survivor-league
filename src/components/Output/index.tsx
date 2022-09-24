import React from 'react';
import { Link } from 'react-router-dom';
import { Path } from '../../model/Paths';
import { PathsOutput } from '../PathsOutput';
import './index.css';

export const Output: React.FC = () => {
	const paths: Path[] = [];

	return (
		<div className="Output">
			<h2 className="Title">Top 10 Paths</h2>

			<p className="Format">Format - {`<path of teams>: <aggregate odds>`}</p>

			<PathsOutput paths={paths} />

			<Link to="/input">Enter another set of input</Link>
		</div>
	);
};
