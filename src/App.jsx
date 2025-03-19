import { useCallback, useEffect, useState } from 'react';
import BookCard from './BookCard';
import Pagination from './Pagination';

export default function Book({ initialBookData }) {
	const [bookData, setBookData] = useState(initialBookData);
	const [favorites, setFavorites] = useState(undefined);
	const [loading, setLoading] = useState(true);
	const [showFavorites, setShowFavorites] = useState(false);

	useEffect(async () => {
		const ws = new WebSocket(`ws://localhost:9926/GutenBookResult/${bookData.id}`);
		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			setBookData(message.value);
		};

		// get the initial favorites data
		await updateFavorites();

		return () => {
			ws.close();
		};
	}, []);

	useEffect(() => {
		// only display data if everything is ready
		if (favorites != null && bookData != null) {
			setLoading(false);
		}
	}, [favorites, bookData]);

	//wanted to use a websocket here for real time updates but could not figure out how to append the consecutive streams
	const updateFavorites = useCallback(async () => {
		console.log('UPDATE FAVS');
		const favoritesResponse = await fetch('http://localhost:9926/GetFavorites/');

		if (favoritesResponse.ok) setFavorites(await favoritesResponse.json());
	}, [favorites, setFavorites]);

	return (
		<article style={{ padding: '1rem 2rem' }}>
			<div style={{ color: '#FDFDFD', fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Book Results</div>
			{!loading && favorites != null && bookData != null ? (
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
					{showFavorites
						? favorites.results.map((favorite) => {
								return <BookCard book={favorite} isFavorite={true} updateFavorites={updateFavorites} />;
							})
						: bookData.results.map((book) => {
								const isFavorite = favorites.some((favoriteData) => `${book.id}` === `${favoriteData.id}`);
								return <BookCard book={book} isFavorite={isFavorite} updateFavorites={updateFavorites} />;
							})}
				</div>
			) : (
				// Ideally would have skeleton loading here
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						height: '88vh',
						color: '#FDFDFD',
						fontSize: '4rem',
						fontWeight: 'bold',
					}}
				>
					Loading...
				</div>
			)}

			<Pagination bookData={bookData} />
		</article>
	);
}
