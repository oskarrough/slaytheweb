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
 * All available animal sprites from animals.txt
 */
export const animalSprites = {
	bears: ['1.a', '1.b', '1.c', '1.d'],
	primates: ['2.a', '2.b', '3.c'],
	'small primates': ['4.a', '4.b', '4.c', '4.d', '4.e'],
	felines: ['5.a', '5.b', '5.c', '5.d', '5.e', '5.f', '5.g', '5.h'],
	canines: ['6.a', '6.b', '6.c', '6.d', '6.e', '6.f', '6.g'],
	rodents: ['7.a', '7.b', '7.c', '7.d', '7.e', '7.f', '7.g', '7.h'],
	'small mammals': ['8.a', '8.b', '8.c', '8.d', '8.e', '8.f', '8.g', '8.h', '8.i'],
	snakes: ['9.a', '9.b', '9.c', '9.d'],
	reptiles: ['10.a', '10.b', '10.c', '10.d', '10.e', '10.f'],
	livestock: ['11.a', '11.b', '11.c', '11.d', '11.e', '11.f', '11.g', '11.h'],
	'large mammals': ['12.a', '12.b', '12.c', '12.d'],
	birds: ['13.a', '13.b', '13.c'],
	marsupials: ['14.a', '14.b'],
	'flightless birds': ['15.a', '15.b', '15.c', '15.d'],
	poultry: ['16.a', '16.b', '16.c', '16.d', '16.e', '16.f', '16.g'],
	caprines: ['17.a', '17.b', '17.c', '17.d', '16.e'],
}

/**
 * All available rogue/character sprites from rogues.txt
 */
export const rogueSprites = {
	adventurers: ['1.a', '1.b', '1.c', '1.d', '1.e'],
	knights: ['2.a', '2.b', '2.c', '2.d', '2.e'],
	clerics: ['3.a', '3.b', '3.c', '3.d', '3.e', '3.f', '3.g'],
	barbarians: ['4.a', '4.b', '4.c', '4.d', '4.e', '4.f'],
	wizards: ['5.a', '5.b', '5.c', '5.d', '5.e', '6.f'],
	peasants: ['7.a', '7.b', '7.c', '7.d', '7.e', '7.f'],
	townsfolk: ['8.a', '8.b', '8.c', '8.d', '8.e'],
}

/**
 * All available item sprites from items.txt
 */
export const itemSprites = {
	'swords (straight)': ['1.a', '1.b', '1.c', '1.d', '1.e', '1.f', '1.g', '1.h', '1.i', '1.j', '1.k'],
	'swords (wide)': ['2.a', '2.b', '2.c', '2.d', '2.e', '2.f', '2.g'],
	'swords (curved)': ['3.a', '3.b', '3.c', '3.d', '3.e'],
	axes: ['4.a', '4.b', '4.c', '4.d', '4.e', '4.f', '4.g'],
	hammers: ['5.a', '5.b', '5.c', '5.d', '5.e'],
	maces: ['6.a', '6.b', '6.c', '6.d'],
	spears: ['7.a', '7.b', '7.c', '7.d', '7.e'],
	flails: ['8.a', '8.b', '8.c'],
	clubs: ['9.a', '9.b', '9.c', '9.d'],
	'bows & crossbows': ['10.a', '10.b', '10.c', '10.d', '10.e'],
	staffs: ['11.a', '11.b', '11.c', '11.d', '11.e', '11.f', '11.g', '11.h', '11.i', '11.j'],
	shields: ['12.a', '12.b', '12.c', '12.d', '12.e', '12.f', '12.g'],
	armor: ['13.a', '13.b', '13.c', '13.d', '13.e', '13.f'],
	gloves: ['14.a', '14.b', '14.c', '14.d'],
	boots: ['15.a', '15.b', '15.c', '15.d'],
	helms: ['16.a', '16.b', '16.c', '16.d', '16.e', '16.f', '16.g', '16.h'],
	pendants: ['17.a', '17.b', '17.c', '17.d', '17.e', '17.f', '17.g'],
	'rings 1': ['18.a', '18.b', '18.c', '18.d', '18.e', '18.f'],
	'rings 2': ['19.a', '19.b', '19.c', '19.d', '19.e', '19.f'],
	'potions 1': ['20.a', '20.b', '20.c', '20.d', '20.e'],
	'potions 2': ['21.a', '21.b', '21.c', '21.d', '21.e'],
	'books & scrolls': ['22.a', '22.b', '22.c', '22.d', '22.e', '22.f', '22.g', '22.h'],
	keys: ['23.a', '23.b', '23.c', '23.d'],
	projectiles: ['24.a', '24.b', '24.c', '24.d'],
	currency: ['25.a', '25.b', '25.c', '25.d'],
	food: ['26.a', '26.b', '26.c', '26.d', '25.e'],
}

/**
 * All available tile sprites from tiles.txt
 */
export const tileSprites = {
	'walls (dirt)': ['1.a', '1.b', '1.c'],
	'walls (rough stone)': ['2.a', '2.b'],
	'walls (stone brick)': ['3.a', '3.b', '3.c'],
	'walls (igneous)': ['4.a', '4.b'],
	'walls (large stone)': ['5.a', '5.b'],
	'walls (catacombs)': ['6.a', '6.b'],
	'floors (stone)': ['7.a', '7.b', '7.c', '7.d', '7.e', '7.f', '7.g'],
	'floors (grass)': ['8.a', '8.b', '8.c', '8.d', '8.e', '8.f', '8.g'],
	'floors (dirt)': ['9.a', '9.b', '9.c', '9.d', '9.e', '9.f', '9.g'],
	'floors (dungeon)': ['10.a', '10.b', '10.c', '10.d', '10.e', '10.f', '10.g'],
	'floors (bones)': ['11.a', '11.b', '11.c', '11.d', '11.e', '11.f', '11.g'],
	'floors (red)': ['12.a', '12.b', '12.c', '12.d', '12.e', '12.f', '12.g'],
	'floors (blue)': ['13.a', '13.b', '13.c', '13.d'],
	'floors (green dirt)': ['14.a', '14.b', '14.c', '14.d'],
	'floors (green grass)': ['15.a', '15.b', '15.c', '15.d'],
	'floors (dark bones)': ['16.a', '16.b', '16.c', '16.d'],
	'dungeon features': [
		'17.a',
		'17.b',
		'17.c',
		'17.d',
		'17.e',
		'17.f',
		'17.g',
		'17.h',
		'17.i',
		'17.j',
		'17.k',
		'17.l',
		'17.m',
		'17.n',
		'17.o',
		'17.p',
		'17.q',
	],
	containers: ['18.a', '18.b', '18.c', '18.d', '18.e', '18.f', '18.g'],
	rocks: ['19.a', '19.b'],
	crops: [
		'20.a',
		'20.b',
		'20.c',
		'20.d',
		'20.e',
		'20.f',
		'20.g',
		'20.h',
		'20.i',
		'20.j',
		'20.k',
		'20.l',
		'20.m',
		'20.n',
		'20.o',
		'20.p',
	],
	mushrooms: ['21.a', '21.b'],
	corpses: ['22.a', '22.b'],
	splatter: ['23.a', '23.b', '23.c', '23.d'],
	coffins: ['24.a', '24.b', '24.c', '24.d', '24.e', '24.f'],
	trees: ['26.a', '26.b', '26.c', '26.d'],
}

/**
 * Get all sprite IDs as flat array
 * @returns {string[]}
 */
export function getAllSpriteIds() {
	return Object.values(monsterSprites).flat()
}
