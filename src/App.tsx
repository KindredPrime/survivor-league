import React from 'react';
import './App.css';
import { FileInput } from './components/FileInput';

const App: React.FC = () => {
	const generatePaths = (data: string): void => {
		console.log(data);
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
