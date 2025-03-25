/**
 * @typedef {Object} Deck
 * @property {string} id
 * @property {string} name
 * @property {string[]} cards
 * @property {boolean} [custom] - whether this is a custom (user) deck
 */

/** @type {Deck} */
export const deck1 = {
	id: 'classic',
	name: 'Classic',
	cards: ['Defend', 'Defend', 'Defend', 'Defend', 'Strike', 'Strike', 'Strike', 'Strike', 'Strike', 'Bash'],
}

/** @type {Deck} */
export const deck2 = {
	id: 'one-of-each',
	name: 'One of each',
	cards: [
		'Adrenaline',
		'Bash',
		'Bludgeon',
		'Body Slam',
		'Clash',
		'Cleave',
		'Defend',
		'Flourish',
		'Intimidate',
		'Iron Wave',
		'Mask of the Faceless',
		'Pommel Strike',
		'Ritual Rain',
		'Soul Drain',
		'Strike',
		'Succube',
		'Sucker Punch',
		'Summer of Sam',
		'Terror',
		'Thunderclap',
		'Voodoo Gift',
	],
}
