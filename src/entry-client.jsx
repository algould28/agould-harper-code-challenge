import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

hydrateRoot(
	document.getElementById('root'),
	<StrictMode>
		<App initialBookData={window.__INITIAL_BOOK_DATA__} />
	</StrictMode>
);
