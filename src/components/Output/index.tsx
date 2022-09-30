import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SurvivorContext } from '../../SurvivorContext';
import { TopPaths } from '../TopPaths';
import './index.css';

export const Output: React.FC = () => {
	const { allPaths } = useContext(SurvivorContext);

	return (
		<div className="Output">
			<TopPaths paths={allPaths} />

			<Link to="/input">Enter another set of input</Link>
		</div>
	);
};
