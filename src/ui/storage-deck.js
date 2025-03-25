/** @typedef {import('../content/decks').Deck} Deck */
import { uuid } from '../utils.js'

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

	// Ensure the deck has a valid name and ID
	const deckToSave = {
		...deck,
		id: deck.id,
		name: deck.name.trim()
	}

	// Get existing decks
	const customDecks = getCustomDecks()

	// Check if a deck with this ID already exists
	const existingIndex = customDecks.findIndex(d => d.id === deckToSave.id)

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
 * Delete a custom deck by id
 * @param {string} deckId - ID of the deck to delete
 * @returns {Deck[]} Updated array of all custom decks
 */
export function deleteDeck(deckId) {
	const customDecks = getCustomDecks()
	const updatedDecks = customDecks.filter(deck => deck.id !== deckId)

	// Save updated list to localStorage
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDecks))

	return updatedDecks
}
