# Tests

Scripts are checked with eslint, formatted with prettier and tested with ava.

Additionally the ./tests folder contains the tests. Usually a test goes 1) create a game 2) modify the game state with one or more actions 3) assert that the final state is how it you expect.

- `yarn test` tests everything once
- `yarn test:watch` tests continously (good while developing)
- `yarn test:coverage` check test code coverage

Additionally you can run yarn eslint public --fix to automatically format all scripts according to the prettier standards.

You can also just run ava directly and do as you please. Example: `yarn ava tests/actions.js --watch`
