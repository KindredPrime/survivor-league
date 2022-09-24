import React, { useState } from 'react';
import { FileInput } from './components/FileInput';
import { PathsOutput } from './components/PathsOutput';
import { Path } from './model/Paths';
import { generatePaths } from './utilities/generatePaths';
import './App.css';

const App: React.FC = () => {
	const [allPaths, setAllPaths] = useState<Path[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [showPaths, setShowPaths] = useState(false);

	return (
		<div className="App">
			<header>
				<h1>Survivor League</h1>
			</header>

			{error !== null && <p className="Error-text">{error}</p>}

			{showPaths && (
				<div className="Top-paths-wrapper">
					<PathsOutput paths={allPaths} />
				</div>
			)}

			<FileInput
				onFileChange={() => setError(null)}
				onSubmit={(weeks) => {
					try {
						setAllPaths([]);
						setShowPaths(false);
						const newPaths: Path[] = generatePaths({ weeks });
						newPaths.sort(
							(pathA, pathB) => pathB.aggregateOdds - pathA.aggregateOdds
						);
						setAllPaths(newPaths);
						setShowPaths(true);
					} catch (e) {
						if (e instanceof RangeError) {
							setError('The input is too large to generate paths');
						} else if (e instanceof Error) {
							setError(`An error occurred: : ${e.message}`);
						} else {
							setError('Something went wrong');
						}
					}
				}}
				pathsAreShown={showPaths}
			/>
		</div>
	);
};

export default App;
