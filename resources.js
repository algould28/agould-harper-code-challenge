import fs from 'node:fs';
import path from 'node:path';
const { GutenBookResult } = tables;

const template = fs.readFileSync(path.join(import.meta.dirname, 'dist/client/index.html'), 'utf-8');
const serverEntry = await import('./dist/server/entry-server.js');

async function renderBookResult(bookResult) {
	console.log('rendering bookResult: ', bookResult);
	const rendered = serverEntry.render({ initialBookData: bookResult });

	const html = template
		.replace(`<!--app-head-->`, rendered.head ?? '')
		.replace(`<!--app-html-->`, rendered.html ?? '')
		.replace(`<!--app-data-->`, `<script>window.__INITIAL_BOOK_DATA__ = ${JSON.stringify(bookResult)};</script>`);

	return html;
}

export class GutenBookSource extends Resource {
	async get() {
		const id = this.getId();
		const idNum = parseInt(id);

		console.log('this: ', this);
		console.log('id: ', id);
		console.log('id type: ', typeof id);
		console.log('idNum: ', idNum);
		console.log('idNum type: ', typeof idNum);

		// get a page of books (0-32 at a time) from the guten book API
		// we use the request id to determine which page to get
		return (await fetch(`https://gutendex.com/books/?page=${idNum + 1}`)).json();
	}
}

GutenBookResult.sourcedFrom(GutenBookSource, { expiration: 3600 });

export class UncachedBookResult extends tables.GutenBookResult {
	async get() {
		return {
			status: 200,
			headers: { 'Content-Type': 'text/html' },
			body: await renderBookResult(this),
		};
	}
}

class BookPageBuilder extends tables.GutenBookResult {
	async get() {
		return {
			content: await renderBookResult(this),
		};
	}
}

tables.BookCache.sourcedFrom(BookPageBuilder);

export class CachedBookResult extends tables.BookCache {
	async get() {
		return {
			contentType: 'text/html',
			data: this.content,
		};
	}
}

export class AddFavorite extends tables.FavoriteBook {
	async post(data) {
		console.log('ADD FAVORITE');
		console.log(data);

		if (data != null && data?.bookId != null) {
			await tables.FavoriteBook.put({
				id: `${data.bookId}`,
				title: data.title,
				authors: data.authors,
				subjects: data.subjects,
			});
		} else {
			console.log('ERROR ADDING FAVORITE');
		}
	}
}

export class RemoveFavorite extends tables.FavoriteBook {
	async post(data) {
		console.log('REMOVE FAVORITE');
		console.log(data);

		if (data != null && data?.bookId != null) {
			tables.FavoriteBook.delete(`${data.bookId}`);
		} else {
			console.log('ERROR REMOVING FAVORITE');
		}
	}
}

export class GetFavorites extends tables.FavoriteBook {
	async get() {
		console.log('GETTING ALL FAVORITES');
		try {
			const options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const favorites = await fetch(`http://localhost:9926/FavoriteBook/`, options)
				.then(async (response) => {
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					return await response.json();
				})
				.catch((error) => {
					console.error('Error:', error);
					return [];
				});

			return favorites;
		} catch (error) {
			console.error('Error getting favorites:', error);
			return [];
		}
	}
}
