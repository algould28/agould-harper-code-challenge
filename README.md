# Austin Gould HarperDB Coding Challenge

This repo is based off of the example repo [react-ssr-example](https://github.com/HarperDB/react-ssr-example/tree/main) and modified to meet the criteria of the coding challenge.

This app uses working examples of Harper's Web Socket, REST, and SSR functionality. The external book data is sourced from [Project Gutenberg](https://gutendex.com/) and interfaces with local data by allowing the user to favorite books and view their list of favorites.

## Get Started

1. `npm i`
2. `npm run dev`
3. Navigate to [/CachedBookResult/0](http://localhost:9926/CachedBookResult/0) or [/UncachedBookResult/0](http://localhost:9926/UncachedBookResult/0)

## Testing

This repo includes a `caching-test.js` script for quickly demonstrating and validating the caching behavior and testing the `FavoriteBook` API Give it a try with `node caching-test.js` (component must be running with HarperDB).
