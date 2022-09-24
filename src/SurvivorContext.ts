import React from 'react';
import { Path } from './model/Paths';

export interface ISurvivorContext {
	allPaths: Path[];
	error: string | null;
	updateError: (newError: string | null) => void;
	updatePaths: (newPaths: Path[]) => void;
}

const defaultContext: ISurvivorContext = {
	allPaths: [],
	error: null,
	updateError: (newError: string | null) => {},
	updatePaths: (newPaths: Path[]) => {},
};
export const SurvivorContext = React.createContext(defaultContext);
