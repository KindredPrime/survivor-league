import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Path } from './model/Paths';
import { ISurvivorContext, SurvivorContext } from './SurvivorContext';
import './App.css';

const App: React.FC = () => {
	const [allPaths, setAllPaths] = useState<Path[]>([]);
	const [error, setError] = useState<string | null>(null);

	const handleErrorUpdate = (newError: string | null): void => {
		setError(newError);
	};

	const handlePathsUpdate = (newPaths: Path[]): void => {
		setAllPaths(newPaths);
	};

	const contextValue: ISurvivorContext = {
		allPaths,
		error,
		updateError: handleErrorUpdate,
		updatePaths: handlePathsUpdate,
	};

	return (
		<div className="App">
			<SurvivorContext.Provider value={contextValue}>
				<header>
					<h1>Survivor League</h1>
				</header>

				{error !== null && <p className="Error-text">{error}</p>}

				<Outlet />
			</SurvivorContext.Provider>
		</div>
	);
};

export default App;
