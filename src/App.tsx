import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
// import { Path } from './model/Paths';
import './App.css';

const App: React.FC = () => {
	// const [allPaths, setAllPaths] = useState<Path[]>([]);
	const [error] = useState<string | null>(null);
	// const [showPaths, setShowPaths] = useState(false);

	return (
		<div className="App">
			<header>
				<h1>Survivor League</h1>
			</header>

			{error !== null && <p className="Error-text">{error}</p>}

			<Outlet />
		</div>
	);
};

export default App;
