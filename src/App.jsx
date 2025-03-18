import { useEffect, useMemo, useState } from 'react';
import BookCard from './BookCard';
import Pagination from './Pagination';

export default function Book({ initialBookData }) {
	const [bookData, setBookData] = useState(initialBookData);

	useEffect(async () => {
		console.log('initial book data');
		console.log(initialBookData);
		const ws = new WebSocket(`ws://localhost:9926/GutenBookResult/${bookData.id}`);
		ws.onmessage = (event) => {
			console.log('WEBSOCKET EVENT');
			const message = JSON.parse(event.data);
			console.log(message);
			setBookData(message.value);
		};

		return () => {
			ws.close();
		};
	}, []);

	return (
		<article style={{ padding: '1rem 2rem' }}>
			<div style={{ color: '#FDFDFD', fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Book Results</div>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(4, 1fr)',
					gap: '1rem',
					marginBottom: '1rem',
					maxHeight: '85vh',
					overflowY: 'scroll',
					scrollbarColor: '#FFFFFF00 #FFFFFF00',
					padding: '0.5rem',
				}}
			>
				{bookData.results.map((book) => {
					return <BookCard book={book} />;
				})}
			</div>

			<Pagination bookData={bookData} />
		</article>
	);
}
