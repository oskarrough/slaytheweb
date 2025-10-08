/**
 * Sprite utilities for 32rogues sprite pack
 * Sprites are 32x32px in a grid layout
 *
 * Each spritesheet (monsters.png, animals.png, etc.) is a grid of 32x32px sprites.
 * Different spritesheets have different widths (measured in columns of sprites).
 *
 * To display a sprite:
 * 1. Use [row, col] or {row, col} to reference it
 * 2. Calculate CSS background-position: x = col × 32px × scale, y = row × 32px × scale
 * 3. Set CSS background-size based on the spritesheet's column count
 *
 * The 2D arrays below mirror the actual spritesheet layout.
 * null represents empty cells in the grid.
 */

const SPRITE_SIZE = 32

// Grid column counts for each spritesheet (width in sprites)
const GRID_COLS = {
	monsters: 12, // 384px ÷ 32px
	animals: 9, // 288px ÷ 32px
	rogues: 7, // 224px ÷ 32px
	items: 11, // 352px ÷ 32px
	tiles: 17, // 544px ÷ 32px
}

/**
 * monsters.png - 12 columns wide
 * 2D array mirrors the actual spritesheet grid layout
 */
const monsterSprites = [
	// Row 0: orcs
	['orc', 'orc wizard', 'goblin', 'orc blademaster', 'orc warchief', 'goblin archer', 'goblin mage', 'goblin brute'],
	// Row 1: giants/ettins
	['ettin', 'two headed ettin', 'troll'],
	// Row 2: slimes
	['small slime', 'big slime', 'slimebody', 'merged slimebodies'],
	// Row 3: cultists
	['faceless monk', 'unholy cardinal'],
	// Row 4: undead
	['skeleton', 'skeleton archer', 'lich', 'death knight', 'zombie', 'ghoul'],
	// Row 5: spirits
	['banshee', 'reaper', 'wraith', 'cultist', 'hag/witch'],
	// Row 6: beasts (fills entire row)
	[
		'giant centipede',
		'lampreymander',
		'giant earthworm',
		'manticore',
		'giant ant',
		'lycanthrope',
		'giant bata',
		'lesser giant ant',
		'giant spider',
		'lesser giant spider',
		'warg/dire wolf',
		'giant rat',
	],
	// Row 7: nature
	['dryad', 'wendigo', 'rock golem', 'centaur', 'naga', 'forest spirit', 'satyr', 'minotaur', 'harpy', 'gorgon/medusa'],
	// Row 8: dragons
	['lizardfolk / kobold (reptile)', 'drake / lesser dragon', 'dragon', 'cockatrice', 'basilisk'],
	// Row 9: kobolds
	['small kobold (canine)', 'kobold (canine)'],
	// Row 10: myconids
	['small myconid', 'large myconid'],
	// Row 11: celestial
	['angel / archangel', 'imp / devil'],
	// Row 12: aberrations
	['small writhing mass', 'large writhing mass', 'writhing humanoid'],
]

/**
 * animals.png - 9 columns wide
 */
const animalSprites = [
	// Row 0: bears
	['grizzly bear', 'black bear', 'polar bear', 'panda'],
	// Row 1: primates
	['chimpanzee', 'gorilla', 'orangutan'],
	// Row 2: small primates
	['aye aye', 'gibbon', 'mandrill', 'capuchin', 'langur'],
	// Row 3: felines
	['cat', 'bobcat', 'cougar', 'cheetah', 'lynx', 'ocelot', 'male lion', 'female lion'],
	// Row 4: canines
	['dog', 'puppy', 'hyena', 'fox', 'jackal', 'coyote', 'wolf'],
	// Row 5: rodents
	['capybara', 'beaver', 'mink', 'mongoose', 'marmot', 'groundhog', 'chinchilla', 'echidna'],
	// Row 6: small mammals
	['aardvark', 'armadillo', 'badger', 'honeybadger', 'coati', 'opossum', 'rabbit', 'hare', 'rat'],
	// Row 7: snakes
	['snake', 'cobra', 'kingsnake', 'black mamba'],
	// Row 8: reptiles
	['alligator', 'monitor lizard', 'iguana', 'tortoise', 'snapping turtle', 'alligator snapping turtle'],
	// Row 9: livestock
	['cow', 'horse', 'donkey', 'mule', 'alpaca', 'llama', 'pig', 'boar'],
	// Row 10: large mammals
	['camel', 'reindeer/caribou', 'water buffalo', 'yak'],
	// Row 11: birds
	['seagull', 'barn owl', 'common buzzard'],
	// Row 12: marsupials
	['kangaroo', 'koala'],
	// Row 13: flightless birds
	['penguin', 'little penguin', 'cassowary', 'emu'],
	// Row 14: poultry
	['chicken', 'rooster', 'mallard duck', 'swan', 'turkey', 'guineafowl', 'peacock'],
	// Row 15: caprines
	['goat', 'mountain goat', 'ibex', 'sheep (ram)', 'sheep (ewe)'],
]

/**
 * rogues.png - 7 columns wide
 */
const rogueSprites = [
	// Row 0: adventurers
	['dwarf', 'elf', 'ranger', 'rogue', 'bandit'],
	// Row 1: knights
	['knight', 'male fighter', 'female knight', 'female knight (helmetless)', 'shield knight'],
	// Row 2: clerics
	['monk', 'priest', 'female war cleric', 'male war cleric', 'templar', 'schema monk', 'elder schema monk'],
	// Row 3: barbarians
	['male barbarian', 'male winter barbarian', 'female winter barbarian', 'swordsman', 'fencer', 'female barbarian'],
	// Row 4: wizards
	['female wizard', 'male wizard', 'druid', 'desert sage', 'dwarf mage', 'warlock'],
	// Row 5: (empty row)
	[],
	// Row 6: peasants
	['farmer (wheat thresher)', 'farmer (scythe)', 'farmer (pitchfork)', 'baker', 'blacksmith', 'scholar'],
	// Row 7: townsfolk
	['peasant / coalburner', 'peasant', 'shopkeep', 'elderly woman', 'elderly man'],
]

/**
 * items.png - 11 columns wide
 */
const itemSprites = [
	// Row 0: swords (straight)
	[
		'dagger',
		'short sword',
		'short sword 2',
		'long sword',
		'bastard sword',
		'zweihander',
		'sanguine dagger',
		'magic dagger',
		'crystal sword',
		'evil sword',
		'flame sword',
	],
	// Row 1: swords (wide)
	['wide short sword', 'wide long sword', 'rapier', 'long rapier', 'flamberge', 'large flamberge', 'great sword'],
	// Row 2: swords (curved)
	['shotel', 'scimitar', 'large scimitar', 'great scimitar', 'kukri'],
	// Row 3: axes
	['hand axe', 'battle axe', 'halberd', 'great axe', 'giant axe', 'hatchet', "woodcutter's axe"],
	// Row 4: hammers
	['blacksmiths hammer', 'short warhammer', 'long warhammer', 'hammer', 'great hammer'],
	// Row 5: maces
	['mace 1', 'mace 2', 'great mace', 'spiked bat'],
	// Row 6: spears
	['spear', 'short spear', 'pitchfork', 'trident', 'magic spear'],
	// Row 7: flails
	['flail 1', 'flail 2', 'flail 3'],
	// Row 8: clubs
	['club', 'spiked club', 'great club', 'club with nails'],
	// Row 9: bows & crossbows
	['crossbow', 'short bow', 'long bow', 'long bow 2', 'large crossbow'],
	// Row 10: staffs
	[
		'crystal staff',
		'holy staff',
		'druid staff',
		'blue staff',
		'golden staff',
		'red crystal staff',
		'flame staff',
		'blue crystal staff',
		'cross staff',
		"saint's staff",
	],
	// Row 11: shields
	['buckler', 'kite shield', 'cross shield', 'dark shield', 'round shield', 'buckler 2', 'large shield'],
	// Row 12: armor
	['cloth armor', 'leather armor', 'robe', 'chain mail', 'scale mail', 'chest plate'],
	// Row 13: gloves
	['cloth gloves', 'leather gloves', 'blue cloth gloves', 'gauntlets'],
	// Row 14: boots
	['shoes', 'leather boots', 'high blue boots', 'greaves'],
	// Row 15: helms
	[
		'cloth hood',
		'leather helm',
		'wide-brimmed hat',
		'chain mail coif',
		'helm',
		'helm with chain mail',
		'plate helm 1',
		'plate helm 2',
	],
	// Row 16: pendants
	['red pendant', 'metal pendant', 'crystal pendant', 'disc pendant', 'cross pendant', 'stone pendant', 'ankh'],
	// Row 17: rings 1
	['gold emerald ring', 'gold band ring', 'green signet ring', 'ruby ring', 'sapphire ring', 'onyx ring'],
	// Row 18: rings 2
	[
		'gold signet ring',
		'silver signet ring',
		'jade ring',
		'silver signet ring',
		'twisted gold ring',
		'twisted metal ring',
	],
	// Row 19: potions 1
	['purple potion', 'red potion', 'brown vial', 'large dark potion', 'green potion'],
	// Row 20: potions 2
	['black potion', 'bright green potion', 'pink vial', 'blue potion', 'orange potion'],
	// Row 21: books & scrolls
	['scroll', 'book', 'red book', 'dark tome', 'tome', 'tome 2', 'scroll 2', 'page'],
	// Row 22: keys
	['gold key', 'ornate key', 'metal key', 'primitive key'],
	// Row 23: projectiles
	['arrow', 'arrows', 'bolt', 'bolts'],
	// Row 24: currency
	['coin', 'small stacks of coins', 'large stacks of coins', 'coin purse'],
	// Row 25: food
	['cheese', 'bread', 'apple', 'bottle of beer', 'bottle of water'],
]

/**
 * tiles.png - 17 columns wide
 */
const tileSprites = [
	// Row 0: walls (dirt)
	['dirt wall (top)', 'dirt wall (side)', 'inner wall'],
	// Row 1: walls (rough stone)
	['rough stone wall (top)', 'rough stone wall (side)'],
	// Row 2: walls (stone brick)
	['stone brick wall (top)', 'stone brick wall (side 1)', 'stone brick wall (side 2)'],
	// Row 3: walls (igneous)
	['igneous wall (top)', 'igneous wall (side)'],
	// Row 4: walls (large stone)
	['large stone wall (top)', 'large stone wall (side)'],
	// Row 5: walls (catacombs)
	['catacombs / skull wall (top)', 'catacombs / skull walls (side)'],
	// Row 6: floors (stone)
	[
		'blank floor (dark grey)',
		'floor stone 1',
		'floor stone 2',
		'floor stone 3',
		'floor stone 1 (no bg)',
		'floor stone 2 (no bg)',
		'floor stone 3 (no bg)',
	],
	// Row 7: floors (grass)
	[
		'blank floor (dark purple)',
		'grass 1',
		'grass 2',
		'grass 3',
		'grass 1 (no bg)',
		'grass 2 (no bg)',
		'grass 3 (no bg)',
	],
	// Row 8: floors (dirt)
	['empty', 'dirt 1', 'dirt 2', 'dirt 3', 'dirt 1 (no bg)', 'dirt 2 (no bg)', 'dirt 3 (no bg)'],
	// Row 9: floors (dungeon)
	[
		'empty',
		'stone floor 1',
		'stone floor 2',
		'stone floor 3',
		'stone floor 1 (no bg)',
		'stone floor 2 (no bg)',
		'stone floor 3 (no bg)',
	],
	// Row 10: floors (bones)
	['empty', 'bone 1', 'bone 2', 'bone 3', 'bone 1 (no bg)', 'bone 2 (no bg)', 'bone 3 (no bg)'],
	// Row 11: floors (red)
	[
		'blank red floor',
		'red stone floor 1 (red bg)',
		'red stone floor 2 (red bg)',
		'red stone floor 3 (red bg)',
		'red stone floor 1 (no bg)',
		'red stone floor 2 (no bg)',
		'red stone floor 3 (no bg)',
	],
	// Row 12: floors (blue)
	['blank blue floor', 'blue stone floor 1 (blue bg)', 'blue stone floor 2 (blue bg)', 'blue stone floor 3 (blue bg)'],
	// Row 13: floors (green dirt)
	['blank green floor', 'dirt 1 (green bg)', 'dirt 2 (green bg)', 'dirt 3 (green bg)'],
	// Row 14: floors (green grass)
	['empty', 'grass 1 (green bg)', 'grass 2 (green bg)', 'grass 3 (green bg)'],
	// Row 15: floors (dark bones)
	['dark brown bg', 'bones 1 (dark brown bg)', 'bones 2 (dark brown bg)', 'bones 3 (dark brown bg)'],
	// Row 16: dungeon features
	[
		'door 1',
		'door 2',
		'framed door 1 (shut)',
		'framed door 1 (open)',
		'framed door 2 (shut)',
		'framed door 2 (open)',
		'grated door',
		'staircase down',
		'staircase up',
		'pressure plate (up)',
		'pressure plate (down)',
		'chute',
		'pit',
		'trap door',
		'pentagram',
		'spikes (down)',
		'spites (up)',
	],
	// Row 17: containers
	['chest (closed)', 'chest (open)', 'jar (closed)', 'jar (open)', 'barrel', 'ore sack', 'log pile'],
	// Row 18: rocks
	['large rock 1', 'large rock 2'],
	// Row 19: crops
	[
		'buckwheet',
		'flax',
		'papyrus sedge',
		'kenaf',
		'ramie',
		'jute',
		'rice',
		'wheat',
		'maize / corn',
		'amaranth',
		'quinoa',
		'bitter vetch',
		'sorghum',
		'red spinach',
		'cotton',
		'alfalfa',
	],
	// Row 20: mushrooms
	['small mushrooms', 'large mushroom'],
	// Row 21: corpses
	['corpse (bones) 1', 'corpse (bones) 2'],
	// Row 22: splatter
	['blood spatter 1', 'blood spatter 2', 'slime (small)', 'slime (large)'],
	// Row 23: coffins
	[
		'coffin (closed)',
		'coffin (ajar)',
		'coffin (open)',
		'sarcophagus (closed)',
		'sarcophagus (ajar)',
		'sarcophagus (open)',
	],
	// Row 24: (empty row)
	[],
	// Row 25: trees
	['sapling', 'small tree', 'tree', 'two tile tree'],
]

/**
 * Get CSS style object for rendering a sprite using row/col coordinates
 * @param {number|Array<number>|{row: number, col: number}} rowOrCoords - Row index, [row, col] array, or {row, col} object
 * @param {number} [col] - Column index (if first param is row number)
 * @param {string} [spritesheet='monsters'] - Which spritesheet to use
 * @param {number} [scale=2] - Scale multiplier (2 = 64px display size)
 * @returns {object} Style object for inline styles
 */
export function getSpriteStyle(rowOrCoords, col, spritesheet = 'monsters', scale = 2) {
	let row

	// Handle different input formats
	if (Array.isArray(rowOrCoords)) {
		// [row, col] format
		;[row, col] = rowOrCoords
		// If 3rd arg is a number, it's scale, and spritesheet is default
		if (typeof spritesheet === 'number') {
			scale = spritesheet
			spritesheet = 'monsters'
		}
	} else if (typeof rowOrCoords === 'object' && rowOrCoords !== null) {
		// {row, col} format
		row = rowOrCoords.row
		col = rowOrCoords.col
		// 2nd arg is spritesheet, 3rd is scale
		if (typeof col === 'string') {
			spritesheet = col
			col = rowOrCoords.col
			if (typeof spritesheet === 'number') {
				scale = spritesheet
				spritesheet = 'monsters'
			}
		}
	} else {
		// (row, col, ...) format
		row = rowOrCoords
	}

	// Calculate position directly from row/col
	const x = col * SPRITE_SIZE * scale
	const y = row * SPRITE_SIZE * scale
	const displaySize = SPRITE_SIZE * scale
	const sheetWidthInSprites = GRID_COLS[spritesheet]
	const scaledSheetWidth = sheetWidthInSprites * SPRITE_SIZE * scale

	return {
		width: `${displaySize}px`,
		height: `${displaySize}px`,
		backgroundImage: `url(/images/characters/32rogues/${spritesheet}.png)`,
		backgroundPosition: `-${x}px -${y}px`,
		backgroundSize: `${scaledSheetWidth}px auto`,
		imageRendering: 'pixelated',
		display: 'inline-block',
	}
}

// Export sprite arrays for external use
export {monsterSprites, animalSprites, rogueSprites, itemSprites, tileSprites}
