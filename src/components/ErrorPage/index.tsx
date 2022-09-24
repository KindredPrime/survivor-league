import React from 'react';
import { Link } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
	return (
		<div className="ErrorPage">
			<h1>Oops!</h1>
			<p>An unexpected error has occurred.</p>

			<Link to="/">Return home</Link>
		</div>
	);
};
