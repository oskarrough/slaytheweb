/**
 * Sprite utilities for 32rogues sprite pack
 * Sprites are 32x32px in a grid layout
 *
 * HOW IT WORKS:
 *
 * Each spritesheet (monsters.png, animals.png, etc.) is a grid of 32x32px sprites.
 * Different spritesheets have different widths (measured in columns of sprites).
 *
 * To display a sprite correctly, we need:
 * 1. Its position in the grid (row, col)
 * 2. The spritesheet's width in columns
 * 3. The CSS background-position to offset to that sprite
 * 4. The CSS background-size to scale the entire sheet correctly
 *
 * SPRITE IDs → POSITIONS:
 * - Each sprite has an ID like "1.a", "7.c", etc. (from the .txt files)
 * - We manually map each ID to a sequential index (0, 1, 2...)
 * - The index is converted to (row, col) using: row = index ÷ columns, col = index % columns
 * - The (row, col) is converted to CSS pixels using: x = col × 32px × scale, y = row × 32px × scale
 *
 * COLUMN COUNTS:
 * - monsters.png: 12 columns (384px wide)
 * - animals.png: 9 columns (288px wide)
 * - rogues.png: 7 columns (224px wide)
 * - items.png: 11 columns (352px wide)
 * - tiles.png: 17 columns (544px wide)
 *
 * Each SPRITE_INDEX map must be manually created based on the actual layout in each spritesheet.
 * The row comments help track where each category starts in the grid.
 */

const SPRITE_SIZE = 32

// Map sprite IDs to their sequential index in the spritesheet
// monsters.png is 12 columns × 13 rows
// Each category starts at column 0 of a new row
const MONSTER_SPRITE_INDEX = {
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

// animals.png is 9 columns wide (288px ÷ 32px)
const ANIMAL_SPRITE_INDEX = {
	// Row 0: bears (4 sprites)
	'1.a': 0,
	'1.b': 1,
	'1.c': 2,
	'1.d': 3,
	// Row 1: primates (3 sprites)
	'2.a': 9,
	'2.b': 10,
	'3.c': 11, // Note: This is labeled 3.c in the sprite pack, not 2.c
	// Row 2: small primates (5 sprites)
	'4.a': 18,
	'4.b': 19,
	'4.c': 20,
	'4.d': 21,
	'4.e': 22,
	// Row 3: felines (8 sprites)
	'5.a': 27,
	'5.b': 28,
	'5.c': 29,
	'5.d': 30,
	'5.e': 31,
	'5.f': 32,
	'5.g': 33,
	'5.h': 34,
	// Row 4: canines (7 sprites)
	'6.a': 36,
	'6.b': 37,
	'6.c': 38,
	'6.d': 39,
	'6.e': 40,
	'6.f': 41,
	'6.g': 42,
	// Row 5: rodents (8 sprites)
	'7.a': 45,
	'7.b': 46,
	'7.c': 47,
	'7.d': 48,
	'7.e': 49,
	'7.f': 50,
	'7.g': 51,
	'7.h': 52,
	// Row 6: small mammals (9 sprites)
	'8.a': 54,
	'8.b': 55,
	'8.c': 56,
	'8.d': 57,
	'8.e': 58,
	'8.f': 59,
	'8.g': 60,
	'8.h': 61,
	'8.i': 62,
	// Row 7: snakes (4 sprites)
	'9.a': 63,
	'9.b': 64,
	'9.c': 65,
	'9.d': 66,
	// Row 8: reptiles (6 sprites)
	'10.a': 72,
	'10.b': 73,
	'10.c': 74,
	'10.d': 75,
	'10.e': 76,
	'10.f': 77,
	// Row 9: livestock (8 sprites)
	'11.a': 81,
	'11.b': 82,
	'11.c': 83,
	'11.d': 84,
	'11.e': 85,
	'11.f': 86,
	'11.g': 87,
	'11.h': 88,
	// Row 10: large mammals (4 sprites)
	'12.a': 90,
	'12.b': 91,
	'12.c': 92,
	'12.d': 93,
	// Row 11: birds (3 sprites)
	'13.a': 99,
	'13.b': 100,
	'13.c': 101,
	// Row 12: marsupials (2 sprites)
	'14.a': 108,
	'14.b': 109,
	// Row 13: flightless birds (4 sprites)
	'15.a': 117,
	'15.b': 118,
	'15.c': 119,
	'15.d': 120,
	// Row 14: poultry (7 sprites)
	'16.a': 126,
	'16.b': 127,
	'16.c': 128,
	'16.d': 129,
	'16.e': 130,
	'16.f': 131,
	'16.g': 132,
	// Row 15: caprines (4-5 sprites)
	'17.a': 135,
	'17.b': 136,
	'17.c': 137,
	'17.d': 138,
	// Note: The last sprite is labeled 16.e in the sprite pack
}

// rogues.png is 7 columns wide (224px ÷ 32px)
const ROGUE_SPRITE_INDEX = {
	// Row 0: adventurers (5 sprites)
	'1.a': 0,
	'1.b': 1,
	'1.c': 2,
	'1.d': 3,
	'1.e': 4,
	// Row 1: knights (5 sprites)
	'2.a': 7,
	'2.b': 8,
	'2.c': 9,
	'2.d': 10,
	'2.e': 11,
	// Row 2: clerics (7 sprites)
	'3.a': 14,
	'3.b': 15,
	'3.c': 16,
	'3.d': 17,
	'3.e': 18,
	'3.f': 19,
	'3.g': 20,
	// Row 3: barbarians (6 sprites)
	'4.a': 21,
	'4.b': 22,
	'4.c': 23,
	'4.d': 24,
	'4.e': 25,
	'4.f': 26,
	// Row 4: wizards (6 sprites - note: 6.f is labeled as such in the sprite pack)
	'5.a': 28,
	'5.b': 29,
	'5.c': 30,
	'5.d': 31,
	'5.e': 32,
	'6.f': 33,
	// Row 6: peasants (6 sprites)
	'7.a': 42,
	'7.b': 43,
	'7.c': 44,
	'7.d': 45,
	'7.e': 46,
	'7.f': 47,
	// Row 7: townsfolk (5 sprites)
	'8.a': 49,
	'8.b': 50,
	'8.c': 51,
	'8.d': 52,
	'8.e': 53,
}

// items.png is 11 columns wide (352px ÷ 32px)
const ITEM_SPRITE_INDEX = {
	// Row 0: swords (straight) - 11 sprites
	'1.a': 0,
	'1.b': 1,
	'1.c': 2,
	'1.d': 3,
	'1.e': 4,
	'1.f': 5,
	'1.g': 6,
	'1.h': 7,
	'1.i': 8,
	'1.j': 9,
	'1.k': 10,
	// Row 1: swords (wide) - 7 sprites
	'2.a': 11,
	'2.b': 12,
	'2.c': 13,
	'2.d': 14,
	'2.e': 15,
	'2.f': 16,
	'2.g': 17,
	// Row 2: swords (curved) - 5 sprites
	'3.a': 22,
	'3.b': 23,
	'3.c': 24,
	'3.d': 25,
	'3.e': 26,
	// Row 3: axes - 7 sprites
	'4.a': 33,
	'4.b': 34,
	'4.c': 35,
	'4.d': 36,
	'4.e': 37,
	'4.f': 38,
	'4.g': 39,
	// Row 4: hammers - 5 sprites
	'5.a': 44,
	'5.b': 45,
	'5.c': 46,
	'5.d': 47,
	'5.e': 48,
	// Row 5: maces - 4 sprites
	'6.a': 55,
	'6.b': 56,
	'6.c': 57,
	'6.d': 58,
	// Row 6: spears - 5 sprites
	'7.a': 66,
	'7.b': 67,
	'7.c': 68,
	'7.d': 69,
	'7.e': 70,
	// Row 7: flails - 3 sprites
	'8.a': 77,
	'8.b': 78,
	'8.c': 79,
	// Row 8: clubs - 4 sprites
	'9.a': 88,
	'9.b': 89,
	'9.c': 90,
	'9.d': 91,
	// Row 9: bows & crossbows - 5 sprites
	'10.a': 99,
	'10.b': 100,
	'10.c': 101,
	'10.d': 102,
	'10.e': 103,
	// Row 10: staffs - 10 sprites
	'11.a': 110,
	'11.b': 111,
	'11.c': 112,
	'11.d': 113,
	'11.e': 114,
	'11.f': 115,
	'11.g': 116,
	'11.h': 117,
	'11.i': 118,
	'11.j': 119,
	// Row 11: shields - 7 sprites
	'12.a': 121,
	'12.b': 122,
	'12.c': 123,
	'12.d': 124,
	'12.e': 125,
	'12.f': 126,
	'12.g': 127,
	// Row 12: armor - 6 sprites
	'13.a': 132,
	'13.b': 133,
	'13.c': 134,
	'13.d': 135,
	'13.e': 136,
	'13.f': 137,
	// Row 13: gloves - 4 sprites
	'14.a': 143,
	'14.b': 144,
	'14.c': 145,
	'14.d': 146,
	// Row 14: boots - 4 sprites
	'15.a': 154,
	'15.b': 155,
	'15.c': 156,
	'15.d': 157,
	// Row 15: helms - 8 sprites
	'16.a': 165,
	'16.b': 166,
	'16.c': 167,
	'16.d': 168,
	'16.e': 169,
	'16.f': 170,
	'16.g': 171,
	'16.h': 172,
	// Row 16: pendants - 7 sprites
	'17.a': 176,
	'17.b': 177,
	'17.c': 178,
	'17.d': 179,
	'17.e': 180,
	'17.f': 181,
	'17.g': 182,
	// Row 17: rings 1 - 6 sprites
	'18.a': 187,
	'18.b': 188,
	'18.c': 189,
	'18.d': 190,
	'18.e': 191,
	'18.f': 192,
	// Row 18: rings 2 - 6 sprites
	'19.a': 198,
	'19.b': 199,
	'19.c': 200,
	'19.d': 201,
	'19.e': 202,
	'19.f': 203,
	// Row 19: potions 1 - 5 sprites
	'20.a': 209,
	'20.b': 210,
	'20.c': 211,
	'20.d': 212,
	'20.e': 213,
	// Row 20: potions 2 - 5 sprites
	'21.a': 220,
	'21.b': 221,
	'21.c': 222,
	'21.d': 223,
	'21.e': 224,
	// Row 21: books & scrolls - 8 sprites
	'22.a': 231,
	'22.b': 232,
	'22.c': 233,
	'22.d': 234,
	'22.e': 235,
	'22.f': 236,
	'22.g': 237,
	'22.h': 238,
	// Row 22: keys - 4 sprites
	'23.a': 242,
	'23.b': 243,
	'23.c': 244,
	'23.d': 245,
	// Row 23: projectiles - 4 sprites
	'24.a': 253,
	'24.b': 254,
	'24.c': 255,
	'24.d': 256,
	// Row 24: currency - 4 sprites
	'25.a': 264,
	'25.b': 265,
	'25.c': 266,
	'25.d': 267,
	// Row 25: food - 5 sprites (note: 25.e is labeled as such in sprite pack)
	'26.a': 275,
	'26.b': 276,
	'26.c': 277,
	'26.d': 278,
	'25.e': 279,
}

// tiles.png is 17 columns wide (544px ÷ 32px)
const TILE_SPRITE_INDEX = {
	// Row 0: walls (dirt) - 3 sprites
	'1.a': 0,
	'1.b': 1,
	'1.c': 2,
	// Row 1: walls (rough stone) - 2 sprites
	'2.a': 17,
	'2.b': 18,
	// Row 2: walls (stone brick) - 3 sprites
	'3.a': 34,
	'3.b': 35,
	'3.c': 36,
	// Row 3: walls (igneous) - 2 sprites
	'4.a': 51,
	'4.b': 52,
	// Row 4: walls (large stone) - 2 sprites
	'5.a': 68,
	'5.b': 69,
	// Row 5: walls (catacombs) - 2 sprites
	'6.a': 85,
	'6.b': 86,
	// Row 6: floors (stone) - 7 sprites
	'7.a': 102,
	'7.b': 103,
	'7.c': 104,
	'7.d': 105,
	'7.e': 106,
	'7.f': 107,
	'7.g': 108,
	// Row 7: floors (grass) - 7 sprites
	'8.a': 119,
	'8.b': 120,
	'8.c': 121,
	'8.d': 122,
	'8.e': 123,
	'8.f': 124,
	'8.g': 125,
	// Row 8: floors (dirt) - 7 sprites
	'9.a': 136,
	'9.b': 137,
	'9.c': 138,
	'9.d': 139,
	'9.e': 140,
	'9.f': 141,
	'9.g': 142,
	// Row 9: floors (dungeon) - 7 sprites
	'10.a': 153,
	'10.b': 154,
	'10.c': 155,
	'10.d': 156,
	'10.e': 157,
	'10.f': 158,
	'10.g': 159,
	// Row 10: floors (bones) - 7 sprites
	'11.a': 170,
	'11.b': 171,
	'11.c': 172,
	'11.d': 173,
	'11.e': 174,
	'11.f': 175,
	'11.g': 176,
	// Row 11: floors (red) - 7 sprites
	'12.a': 187,
	'12.b': 188,
	'12.c': 189,
	'12.d': 190,
	'12.e': 191,
	'12.f': 192,
	'12.g': 193,
	// Row 12: floors (blue) - 4 sprites
	'13.a': 204,
	'13.b': 205,
	'13.c': 206,
	'13.d': 207,
	// Row 13: floors (green dirt) - 4 sprites
	'14.a': 221,
	'14.b': 222,
	'14.c': 223,
	'14.d': 224,
	// Row 14: floors (green grass) - 4 sprites
	'15.a': 238,
	'15.b': 239,
	'15.c': 240,
	'15.d': 241,
	// Row 15: floors (dark bones) - 4 sprites
	'16.a': 255,
	'16.b': 256,
	'16.c': 257,
	'16.d': 258,
	// Row 16: dungeon features - 17 sprites (fills entire row)
	'17.a': 272,
	'17.b': 273,
	'17.c': 274,
	'17.d': 275,
	'17.e': 276,
	'17.f': 277,
	'17.g': 278,
	'17.h': 279,
	'17.i': 280,
	'17.j': 281,
	'17.k': 282,
	'17.l': 283,
	'17.m': 284,
	'17.n': 285,
	'17.o': 286,
	'17.p': 287,
	'17.q': 288,
	// Row 17: containers - 7 sprites
	'18.a': 289,
	'18.b': 290,
	'18.c': 291,
	'18.d': 292,
	'18.e': 293,
	'18.f': 294,
	'18.g': 295,
	// Row 18: rocks - 2 sprites
	'19.a': 306,
	'19.b': 307,
	// Row 19: crops - 16 sprites
	'20.a': 323,
	'20.b': 324,
	'20.c': 325,
	'20.d': 326,
	'20.e': 327,
	'20.f': 328,
	'20.g': 329,
	'20.h': 330,
	'20.i': 331,
	'20.j': 332,
	'20.k': 333,
	'20.l': 334,
	'20.m': 335,
	'20.n': 336,
	'20.o': 337,
	'20.p': 338,
	// Row 20: mushrooms - 2 sprites
	'21.a': 340,
	'21.b': 341,
	// Row 21: corpses - 2 sprites
	'22.a': 357,
	'22.b': 358,
	// Row 22: splatter - 4 sprites
	'23.a': 374,
	'23.b': 375,
	'23.c': 376,
	'23.d': 377,
	// Row 23: coffins - 6 sprites
	'24.a': 391,
	'24.b': 392,
	'24.c': 393,
	'24.d': 394,
	'24.e': 395,
	'24.f': 396,
	// Row 25: trees - 4 sprites (note: row 24 is skipped in sprite pack)
	'26.a': 425,
	'26.b': 426,
	'26.c': 427,
	'26.d': 428,
}

// Grid column counts for each spritesheet (width in sprites)
const GRID_COLS = {
	monsters: 12, // 384px ÷ 32px
	animals: 9, // 288px ÷ 32px
	rogues: 7, // 224px ÷ 32px
	items: 11, // 352px ÷ 32px
	tiles: 17, // 544px ÷ 32px
}

/**
 * Get the appropriate sprite index map for a spritesheet
 * @param {string} spritesheet - Which spritesheet to use
 * @returns {object} The sprite index map
 */
function getSpriteIndex(spritesheet) {
	switch (spritesheet) {
		case 'monsters':
			return MONSTER_SPRITE_INDEX
		case 'animals':
			return ANIMAL_SPRITE_INDEX
		case 'rogues':
			return ROGUE_SPRITE_INDEX
		case 'items':
			return ITEM_SPRITE_INDEX
		case 'tiles':
			return TILE_SPRITE_INDEX
		default:
			throw new Error(`Unknown spritesheet: ${spritesheet}`)
	}
}

/**
 * Parse sprite ID (e.g., "7.c") into grid coordinates
 * @param {string} spriteId - e.g., "7.c" or "1.a"
 * @param {string} [spritesheet='monsters'] - Which spritesheet to use
 * @returns {{row: number, col: number}} Zero-indexed grid coordinates
 */
export function parseSpriteId(spriteId, spritesheet = 'monsters') {
	if (!spriteId || typeof spriteId !== 'string') {
		throw new Error(`Invalid sprite ID: ${spriteId}`)
	}

	const spriteIndex = getSpriteIndex(spritesheet)
	const index = spriteIndex[spriteId]
	if (index === undefined) {
		throw new Error(`Unknown sprite ID: ${spriteId} in spritesheet: ${spritesheet}`)
	}

	// Convert sequential index to grid position
	const cols = GRID_COLS[spritesheet]
	const row = Math.floor(index / cols)
	const col = index % cols

	return {row, col}
}

/**
 * Get CSS background-position for a sprite ID
 * @param {string} spriteId - e.g., "7.c"
 * @param {string} [spritesheet='monsters'] - Which spritesheet to use
 * @param {number} [scale=2] - Scale multiplier to match backgroundSize
 * @returns {string} CSS background-position value, e.g., "-64px -192px"
 */
export function getSpritePosition(spriteId, spritesheet = 'monsters', scale = 2) {
	const {row, col} = parseSpriteId(spriteId, spritesheet)
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
	const position = getSpritePosition(spriteId, spritesheet, scale)
	const displaySize = SPRITE_SIZE * scale
	// Get the correct column count for this spritesheet
	const sheetWidthInSprites = GRID_COLS[spritesheet]
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
