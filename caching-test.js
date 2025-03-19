import assert from 'node:assert';

const book_url = new URL('http://localhost:9926/CachedBookResult/0');
const favoriteId = '51515151481451781515';

// Step 1. Request the Page so it gets SSR'd
const r1 = await fetch(book_url);

// Retrieve the cache headers
let etag = r1.headers.get('ETag');
let last_modified = r1.headers.get('Last-Modified');

// Step 2. Load the Page a second time using the respective cache headers
const r2 = await fetch(book_url, {
	headers: {
		'If-None-Match': etag,
		'If-Modified-Since': last_modified,
	},
});
// And assert we get a cache hit (304)
assert(r2.status === 304, `Expected 304 status code, got ${r2.status}`);

// test adding a favorite
const r3 = await fetch('http://localhost:9926/AddFavorite', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		bookId: favoriteId,
		title: 'Testing Book',
		authors: [],
		subjects: [],
	}),
})
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return 'ok';
	})
	.catch((error) => {
		return error;
	});

assert(r3 === 'ok', `Exepected Adding a Favorite to return "ok", got: ${r3}`);

// test getting a favorite
const r4 = await fetch(`http://localhost:9926/FavoriteBook/${favoriteId}`, {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
	},
})
	.then(async (response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const jsonRes = await response.json();
		return jsonRes.id;
	})
	.catch((error) => {
		return error;
	});

assert(r4 === favoriteId, `Exepected Getting a Favorite to return the favorite json, got: ${r4}`);

// test removing a favorite
const r5 = await fetch('http://localhost:9926/RemoveFavorite', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		bookId: favoriteId,
	}),
})
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return 'ok';
	})
	.catch((error) => {
		return error;
	});

assert(r5 === 'ok', `Exepected Removing a Favorite to return "ok", got: ${r5}`);
