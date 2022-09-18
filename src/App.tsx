import React from 'react';
import './App.css';
import { FileInput } from './components/FileInput';
import { Week } from './model/Games';

const App: React.FC = () => {
	const generatePaths = (weeks: Week[]): void => {
		console.log(weeks);
	};

	return (
		<div className="App">
			<header>
				<h1>Survivor League</h1>
			</header>

			<FileInput onSubmit={generatePaths} />
		</div>
	);
};

export default App;
