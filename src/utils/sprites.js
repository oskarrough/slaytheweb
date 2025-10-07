/**
 * Sprite utilities for 32rogues sprite pack
 * Sprites are 32x32px in a grid layout
 */

const SPRITE_SIZE = 32

// Map sprite IDs to their sequential index in the spritesheet
// monsters.png is 12 columns × 13 rows
// Each category starts at column 0 of a new row
const SPRITE_INDEX = {
	// Row 0: orcs (8 sprites)
	'1.a': 0,
	'1.b': 1,
	'1.c': 2,
	'1.d': 3,
	'1.e': 4,
	'1.f': 5,
	'1.g': 6,
	'1.h': 7,
	// Row 1: giants/ettins (3 sprites)
	'2.a': 12,
	'2.b': 13,
	'2.c': 14,
	// Row 2: slimes (4 sprites)
	'3.a': 24,
	'3.b': 25,
	'3.c': 26,
	'3.d': 27,
	// Row 3: cultists (2 sprites)
	'4.a': 36,
	'4.b': 37,
	// Row 4: undead (6 sprites)
	'5.a': 48,
	'5.b': 49,
	'5.c': 50,
	'5.d': 51,
	'5.e': 52,
	'5.f': 53,
	// Row 5: spirits (5 sprites)
	'6.a': 60,
	'6.b': 61,
	'6.c': 62,
	'6.d': 63,
	'6.e': 64,
	// Row 6: beasts (12 sprites, fills entire row)
	'7.a': 72,
	'7.b': 73,
	'7.c': 74,
	'7.d': 75,
	'7.e': 76,
	'7.f': 77,
	'7.g': 78,
	'7.h': 79,
	'7.i': 80,
	'7.j': 81,
	'7.k': 82,
	'7.l': 83,
	// Row 7: nature (10 sprites - dryad, wendigo, rock golem, etc.)
	'8.a': 84,
	'8.b': 85,
	'8.c': 86,
	'8.d': 87,
	'8.e': 88,
	'8.f': 89,
	'8.g': 90,
	'8.h': 91,
	'8.i': 92,
	'8.j': 93,
	// Row 8: dragons (5 sprites)
	'9.a': 96,
	'9.b': 97,
	'9.c': 98,
	'9.d': 99,
	'9.e': 100,
	// Row 9: kobolds (2 sprites)
	'10.a': 108,
	'10.b': 109,
	// Row 10: myconids (2 sprites)
	'11.a': 120,
	'11.b': 121,
	// Row 11: celestial (2 sprites)
	'12.a': 132,
	'12.b': 133,
	// Row 12: aberrations (3 sprites)
	'13.a': 144,
	'13.b': 145,
	'13.c': 146,
}

const GRID_COLS = 12

/**
 * Parse sprite ID (e.g., "7.c") into grid coordinates
 * @param {string} spriteId - e.g., "7.c" or "1.a"
 * @returns {{row: number, col: number}} Zero-indexed grid coordinates
 */
export function parseSpriteId(spriteId) {
	if (!spriteId || typeof spriteId !== 'string') {
		throw new Error(`Invalid sprite ID: ${spriteId}`)
	}

	const index = SPRITE_INDEX[spriteId]
	if (index === undefined) {
		throw new Error(`Unknown sprite ID: ${spriteId}`)
	}

	// Convert sequential index to grid position
	const row = Math.floor(index / GRID_COLS)
	const col = index % GRID_COLS

	return {row, col}
}

/**
 * Get CSS background-position for a sprite ID
 * @param {string} spriteId - e.g., "7.c"
 * @param {number} [scale=2] - Scale multiplier to match backgroundSize
 * @returns {string} CSS background-position value, e.g., "-64px -192px"
 */
export function getSpritePosition(spriteId, scale = 2) {
	const {row, col} = parseSpriteId(spriteId)
	const x = col * SPRITE_SIZE * scale
	const y = row * SPRITE_SIZE * scale
	return `-${x}px -${y}px`
}

/**
 * Get CSS style object for rendering a sprite
 * @param {string} spriteId - e.g., "7.c"
 * @param {string} [spritesheet='monsters'] - Which spritesheet to use
 * @param {number} [scale=2] - Scale multiplier (2 = 64px display size)
 * @returns {object} Style object for inline styles
 */
export function getSpriteStyle(spriteId, spritesheet = 'monsters', scale = 2) {
	const position = getSpritePosition(spriteId, scale)
	const displaySize = SPRITE_SIZE * scale
	// monsters.png is 384px wide (12 columns × 32px)
	const sheetWidthInSprites = 12
	const scaledSheetWidth = sheetWidthInSprites * SPRITE_SIZE * scale

	return {
		width: `${displaySize}px`,
		height: `${displaySize}px`,
		backgroundImage: `url(/images/characters/32rogues/${spritesheet}.png)`,
		backgroundPosition: position,
		backgroundSize: `${scaledSheetWidth}px auto`,
		imageRendering: 'pixelated',
		display: 'inline-block',
	}
}

/**
 * All available monster sprites from monsters.txt
 * Organized by category for easy browsing
 */
export const monsterSprites = {
	orcs: ['1.a', '1.b', '1.c', '1.d', '1.e', '1.f', '1.g', '1.h'],
	giants: ['2.a', '2.b', '2.c'],
	slimes: ['3.a', '3.b', '3.c', '3.d'],
	cultists: ['4.a', '4.b'],
	undead: ['5.a', '5.b', '5.c', '5.d', '5.e', '5.f'],
	spirits: ['6.a', '6.b', '6.c', '6.d', '6.e'],
	beasts: ['7.a', '7.b', '7.c', '7.d', '7.e', '7.f', '7.g', '7.h', '7.i', '7.j', '7.k', '7.l'],
	nature: ['8.a', '8.b', '8.c', '8.d', '8.e', '8.f', '8.g', '8.h', '8.i', '8.j'],
	dragons: ['9.a', '9.b', '9.c', '9.d', '9.e'],
	kobolds: ['10.a', '10.b'],
	myconids: ['11.a', '11.b'],
	celestial: ['12.a', '12.b'],
	aberrations: ['13.a', '13.b', '13.c'],
}

/**
 * Get all sprite IDs as flat array
 * @returns {string[]}
 */
export function getAllSpriteIds() {
	return Object.values(monsterSprites).flat()
}
