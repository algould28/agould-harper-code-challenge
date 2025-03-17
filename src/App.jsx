import { useEffect, useMemo, useState } from 'react';

export default function Book({ initialBookData }) {
	const [bookResult, setBookResult] = useState(initialBookData);
	const currentPage = useMemo(() => parseInt(bookResult?.id), [bookResult]);
	const totalPages = useMemo(() => parseInt(bookResult?.count) / 32, [bookResult]);

	useEffect(async () => {
		const ws = new WebSocket(`ws://localhost:9926/GutenBookResult/${bookResult.id}`);
		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			setBookResult(message.value);
		};

		// const favResult = await fetch(`http://localhost:9926/GetFavorites`);
		// console.log('Fav Result Call: ');
		// console.log(favResult);

		return () => {
			ws.close();
		};
	}, []);

	const addFavorite = (book) => {
		const url = `${window.location.protocol}//${window.location.host}/AddFavorite`;
		const data = {
			bookId: book.id,
			title: book.title,
			authors: book.authors,
			subjects: book.subjects,
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};

		fetch(url, options)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((responseData) => {
				console.log('Success:', responseData);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	const removeFavorite = (book) => {
		const url = `${window.location.protocol}//${window.location.host}/RemoveFavorite`;
		const data = {
			bookId: book.id,
		};

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};

		fetch(url, options)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((responseData) => {
				console.log('Success:', responseData);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

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
				{bookResult.results.map((book) => {
					const [isFavorite, setIsFavorite] = useState(false);

					return (
						<div
							key={book.id}
							style={{
								backgroundColor: '#e5e5e5',
								padding: '0.75rem',
								borderRadius: '8px',
								boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
								transition: 'all 0.2s ease-in-out',
								gap: '0.5rem',
								display: 'flex',
								flexDirection: 'column',
								position: 'relative', // Added for heart positioning
								paddingRight: '3rem', // Added for heart positioning
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.transform = 'scale(1.05)';
								e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.transform = 'scale(1)';
								e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
							}}
						>
							<button
								onClick={() => {
									if (isFavorite) {
										removeFavorite(book);
									} else {
										addFavorite(book);
									}

									setIsFavorite(!isFavorite);
								}}
								style={{
									position: 'absolute',
									top: '0.25rem',
									right: '0.25rem',
									border: 'none',
									background: 'none',
									cursor: 'pointer',
									padding: '0.25rem',
									borderRadius: '50%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transition: 'background-color 0.2s ease',
								}}
								onMouseOver={(e) => {
									e.currentTarget.style.backgroundColor = '#7a3a8722';
								}}
								onMouseOut={(e) => {
									e.currentTarget.style.backgroundColor = 'transparent';
								}}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill={isFavorite ? '#7a3a87' : 'none'}
									stroke="#7a3a87"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									style={{
										transition: 'all 0.2s ease',
									}}
									className={`heart-icon`}
								>
									<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
								</svg>
							</button>
							<div style={{ fontWeight: 'bold', fontSize: '12px' }}>{book.title}</div>
							<div style={{ fontSize: '8px' }}>{book.id}</div>
							<div style={{ fontSize: '8px' }}>{book.media_type}</div>
							<div style={{ fontSize: '8px' }}>{book.download_count}</div>
						</div>
					);
				})}
			</div>

			{/* Page navigation */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '1rem',
					color: '#FDFDFD',
				}}
			>
				<button
					style={{
						padding: '0.5rem 1rem',
						borderRadius: '4px',
						border: 'none',
						backgroundColor: '#403b8a',
						color: '#FDFDFD',
						cursor: 'pointer',
						transition: 'background-color 0.2s ease',
					}}
					onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#504b9a')}
					onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#403b8a')}
					onClick={() => (window.location.href = `/CachedBookResult/${currentPage - 1}`)}
				>
					←
				</button>
				<div
					style={{ fontSize: '1.2rem', minWidth: '3rem', textAlign: 'center' }}
				>{`${currentPage} of ${totalPages}`}</div>
				<button
					style={{
						padding: '0.5rem 1rem',
						borderRadius: '4px',
						border: 'none',
						backgroundColor: '#403b8a',
						color: '#FDFDFD',
						cursor: 'pointer',
						transition: 'background-color 0.2s ease',
					}}
					onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#504b9a')}
					onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#403b8a')}
					onClick={() => (window.location.href = `/CachedBookResult/${currentPage + 1}`)}
				>
					→
				</button>
			</div>
		</article>
	);
}
