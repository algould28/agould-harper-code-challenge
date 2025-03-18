import { useMemo } from 'react';

export default function Pagination({ bookData }) {
	const currentPage = useMemo(() => parseInt(bookData?.id), [bookData]);
	// guten index returns results of 32 so each page will have 32 results
	const totalPages = useMemo(() => Math.floor(parseInt(bookData?.count) / 32), [bookData]);

	return (
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
	);
}
