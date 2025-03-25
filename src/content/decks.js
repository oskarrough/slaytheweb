/**
 * @typedef {Object} Deck
 * @property {string} name
 * @property {string[]} cards
 */

/** @type {Deck} */
export const deck1 = {
	name: 'Classic',
	cards: ['Defend', 'Defend', 'Defend', 'Defend', 'Strike', 'Strike', 'Strike', 'Strike', 'Strike', 'Bash'],
}

/** @type {Deck} */
export const deck2 = {
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

// Storage key for custom decks
const STORAGE_KEY = 'slaytheweb_custom_decks'

/**
 * Get all custom decks from localStorage
 * @returns {Deck[]} Array of custom decks
 */
export function getCustomDecks() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
	} catch (error) {
		console.error('Error loading custom decks:', error)
		return []
	}
}

/**
 * Save a custom deck to localStorage
 * @param {Deck} deck - The deck to save
 * @returns {Deck[]} Updated array of all custom decks
 */
export function saveDeck(deck) {
	if (!deck.cards || !deck.cards.length) {
		throw new Error('Cannot save deck without cards')
	}

	// Ensure the deck has a valid name
	const deckToSave = {
		...deck,
		name: deck.name.trim() || 'My Custom Deck',
	}

	// Get existing decks
	const customDecks = getCustomDecks()
	
	// Check if a deck with this name already exists
	const existingIndex = customDecks.findIndex(d => d.name === deckToSave.name)
	
	if (existingIndex >= 0) {
		// Update existing deck
		customDecks[existingIndex] = deckToSave
	} else {
		// Add new deck
		customDecks.push(deckToSave)
	}
	
	// Save to localStorage
	localStorage.setItem(STORAGE_KEY, JSON.stringify(customDecks))
	
	return customDecks
}

/**
 * Delete a custom deck by name
 * @param {string} deckName - Name of the deck to delete
 * @returns {Deck[]} Updated array of all custom decks
 */
export function deleteDeck(deckName) {
	const customDecks = getCustomDecks()
	const updatedDecks = customDecks.filter(deck => deck.name !== deckName)
	
	// Save updated list to localStorage
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDecks))
	
	return updatedDecks
}

/**
 * Get all decks (built-in and custom)
 * @returns {Object} Object containing both built-in and custom decks
 */
export function getAllDecks() {
	return {
		builtin: { deck1, deck2 },
		custom: getCustomDecks()
	}
}
