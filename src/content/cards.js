// List of filenames from /src/content/cards/*.js
const cardIndex = [
	'acrobatics',
	'adrenaline',
	'backflip',
	'backstab',
	'bandage',
	'bludgeon',
	'body-slam',
	'bulwark',
	'clash',
	'dagger-spray',
	'dash',
	'defend',
	'deflect',
	'die_die_die',
	'flourish',
	'intimidate',
	'iron-wave',
	'mask-of-the-faceless',
	'neutralize',
	'quick-slash',
	'shiv',
	'slice',
	'soul-drain',
	'strike',
	'sucker-punch',
	'survivor',
	'terror',
]

/**
 * A collection of all existing cards in this game.
 * @type {import("../game/cards.js").CARD[]}
 */
export const cards = []

/**
 * A map of card names to their upgrade function.
 */
export const cardUpgrades = {}

// Use Vite's glob import to import all cards. We don't use this because it'll make the project dependent on vite.
// const modules = import.meta.glob('./cards/*.js', {eager: true})
// for (const module of Object.values(modules)) {
// 	cards.push(module.default)
// 	cardUpgrades[module.default.name] = module.upgrade
// }

// Fill out the cards and upgrades maps.
for (const fileName of cardIndex) {
	// @ts-ignore
	const module = await import(`./cards/${fileName}.js`)
	cards.push(module.default)
	cardUpgrades[module.default.name] = module.upgrade
}
