import {devalue} from '../web_modules/devalue.js'

window.devalue = devalue

// Encodes the game state and stores it in the URL.
export const saveGame = (state) => {
	try {
		devalue(state)
		location.hash = encodeURIComponent()
	} catch (err) {
		console.log(err)
		console.log(err.path)
	}
}

// Parses
export const loadGame = () => JSON.parse(decodeURIComponent(window.location.hash.split('#')[1]))

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
const getCircularReplacer = () => {
	const seen = new WeakSet()
	return (key, value) => {
		if (typeof value === 'object' && value !== null) {
			if (seen.has(value)) {
				return
			}
			seen.add(value)
		}
		return value
	}
}
