export default function BookCard({ book, isFavorite, updateFavorites }) {
	const addFavorite = async (book) => {
		const url = `${window.location.protocol}//${window.location.host}/AddFavorite`;
		const data = {
			bookId: book.id,
			title: book.title,
			authors: book.authors,
			subjects: book.subjects,
		};

		await makeFavoriteAPICall(url, data);
	};

	const removeFavorite = async (book) => {
		const url = `${window.location.protocol}//${window.location.host}/RemoveFavorite`;
		const data = {
			bookId: book.id,
		};

		await makeFavoriteAPICall(url, data);
	};

	const makeFavoriteAPICall = async (url, data) => {
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};

		await fetch(url, options)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return 'ok';
			})
			.then((responseData) => {
				console.log('Success:', responseData);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	const multipleAuthors = book?.authors.length > 1;
	let authorText = `Author${multipleAuthors ? 's' : ''}: `;
	book.authors.forEach((person, index) => {
		authorText += person.name;
		//check if it's the final entry
		authorText += index === book.authors.length - 1 ? '' : '; ';
	});

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
				onClick={async () => {
					if (isFavorite) {
						await removeFavorite(book);
					} else {
						await addFavorite(book);
					}

					await updateFavorites();
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
			<div style={{ fontWeight: 'bold', fontSize: '14px' }}>{book.title}</div>
			<div style={{ fontSize: '10px' }}>{authorText}</div>
			<div style={{ fontSize: '10px' }}>{`Downloads: ${book.download_count}`}</div>
		</div>
	);
}
