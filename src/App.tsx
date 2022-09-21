import React, { useEffect, useState } from 'react';
import { FileInput } from './components/FileInput';
import { PathsOutput } from './components/PathsOutput';
import { Path } from './model/Paths';
import { generatePaths } from './utilities/generatePaths';
import './App.css';

const App: React.FC = () => {
	const [allPaths, setAllPaths] = useState<Path[]>([]);
	const [showPaths, setShowPaths] = useState(false);

	useEffect(() => {
		console.log('All Paths:');
		console.log(allPaths);
	}, [allPaths]);

	return (
		<div className="App">
			<header>
				<h1>Survivor League</h1>
			</header>

			{showPaths && (
				<div className="Top-paths-wrapper">
					<PathsOutput paths={allPaths} />
				</div>
			)}

			<FileInput
				onSubmit={(weeks) => {
					const newPaths: Path[] = generatePaths({ weeks });
					setAllPaths(newPaths);
					setShowPaths(true);
				}}
				pathsAreShown={showPaths}
			/>
		</div>
	);
};

export default App;
