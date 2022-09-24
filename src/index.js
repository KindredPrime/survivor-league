import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { ErrorPage } from './components/ErrorPage';
import { Input } from './components/Input';
import { Output } from './components/Output';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Input />,
			},
			{
				path: '/input',
				element: <Input />,
			},
			{
				path: '/output',
				element: <Output />,
			},
		],
	},
	{
		path: '/input',
		element: <Input />,
	},
	{
		path: '/output',
		element: <Output />,
	},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
