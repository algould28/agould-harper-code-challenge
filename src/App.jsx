import { useCallback, useEffect, useState } from 'react';
import BookCard from './BookCard';
import Pagination from './Pagination';

export default function Book({ initialBookData }) {
	const [bookData, setBookData] = useState(initialBookData);
	const [favorites, setFavorites] = useState(undefined);
	const [loading, setLoading] = useState(true);

	useEffect(async () => {
		const ws = new WebSocket(`ws://localhost:9926/GutenBookResult/${bookData.id}`);
		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			setBookData(message.value);
		};

		await updateFavorites();

		return () => {
			ws.close();
		};
	}, []);

	useEffect(() => {
		if (favorites != null && bookData != null) {
			setLoading(false);
		}
	}, [favorites, bookData]);

	const updateFavorites = useCallback(async () => {
		console.log('UPDATE FAVS');
		const favoritesResponse = await fetch('http://localhost:9926/GetFavorites/');

		if (favoritesResponse.ok) setFavorites(await favoritesResponse.json());
	}, [favorites, setFavorites]);

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
				{!loading && favorites != null && bookData != null ? (
					bookData.results.map((book) => {
						const isFavorite = favorites.some((favoriteData) => `${book.id}` === `${favoriteData.id}`);
						return <BookCard book={book} isFavorite={isFavorite} updateFavorites={updateFavorites} />;
					})
				) : (
					<div>loading</div>
				)}
			</div>

			<Pagination bookData={bookData} />
		</article>
	);
}
