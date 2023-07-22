import superjson from 'superjson'

// Helpers to save and load the entire game state.
// We can't use JSON.stringify/parse because the state contains Set()s and Map()s.
// superjson, however, does support serializing this.

export function encode(state) {
	return superjson.stringify(state)
}

export function decode(state) {
	return superjson.parse(state)
}

// Encodes a game state and stores it in the URL as a hash parameter.
export function saveToUrl(state) {
	try {
		location.hash = encodeURIComponent(encode(state))
	} catch (err) {
		console.log(err)
	}
}

// Reads a game state from the URL and decode it.
export function loadFromUrl() {
	const state = decodeURIComponent(window.location.hash.split('#')[1])
	return decode(state)
}
