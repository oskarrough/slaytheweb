import superjson from 'superjson'

export function encode(state) {
	return superjson.stringify(state)
}

export function decode(state) {
	return superjson.parse(state)
}

// Encodes the game state and stores it in the URL.
export const saveGame = (state) => {
	try {
		location.hash = encodeURIComponent(encode(state))
	} catch (err) {
		console.log(err)
	}
}

export const loadGameFromUrl = () => decode(readStateFromUrl())

function readStateFromUrl() {
	return decodeURIComponent(window.location.hash.split('#')[1])
}
