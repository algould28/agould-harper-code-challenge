import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render({ initialBookData }) {
	const html = renderToString(
		<StrictMode>
			<App initialBookData={initialBookData} />
		</StrictMode>
	);
	return { html };
}
