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
		console.log({ favorites, bookData });
		// only display data if everything is ready
		if (favorites != null && bookData != null) {
			setLoading(false);
		}
	}, [favorites, bookData]);

	//wanted to use a websocket here for real time updates but could not figure out how to append the consecutive streams
	const updateFavorites = useCallback(async () => {
		const favoritesResponse = await fetch('http://localhost:9926/GetFavorites/');

		if (favoritesResponse.ok) setFavorites(await favoritesResponse.json());
	}, [favorites, setFavorites]);

	const toggleFavoritesView = useCallback(() => {
		setShowFavorites(!showFavorites);
	}, [showFavorites, setShowFavorites]);

	const updateLoading = useCallback(
		(isLoading) => {
			console.log(bookData.id);
			setLoading(isLoading);
		},
		[setLoading, bookData]
	);

	return (
		<article style={{ padding: '1rem 2rem' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<div style={{ color: '#FDFDFD', fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
					Book Results
				</div>
				<button
					style={{
						padding: '0.5rem 1rem',
						borderRadius: '4px',
						border: 'none',
						backgroundColor: '#55c58f',
						color: '#FDFDFD',
						cursor: 'pointer',
						transition: 'background-color 0.2s ease',
					}}
					onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#55c58fBB')}
					onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#55c58f')}
					onClick={toggleFavoritesView}
				>
					{showFavorites ? 'Show Books' : 'Show Favorites'}
				</button>
			</div>

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
						? favorites.map((favorite) => {
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

			{!showFavorites && <Pagination bookData={bookData} updateLoading={updateLoading} />}
		</article>
	);
}
