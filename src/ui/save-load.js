// import {devalue} from '../web_modules/devalue.js'

// window.devalue = devalue

export function encodeState(state) {
	// return devalue(state)
	return JSON.stringify(state)
}

export function decodeState(state) {
	// const simplestate = devalue(state)
	// console.log({state, simplestate})
	return JSON.parse(state)
}

// Encodes the game state and stores it in the URL.
export const saveGame = (state) => {
	try {
		location.hash = encodeURIComponent(encodeState(state))
	} catch (err) {
		console.log(err)
	}
}

function readStateFromURL() {
	return decodeURIComponent(window.location.hash.split('#')[1])
}

export const loadGame = () => decodeState(readStateFromURL())

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
// const getCircularReplacer = () => {
// 	const seen = new WeakSet()
// 	return (key, value) => {
// 		if (typeof value === 'object' && value !== null) {
// 			if (seen.has(value)) {
// 				return
// 			}
// 			seen.add(value)
// 		}
// 		return value
// 	}
// }
