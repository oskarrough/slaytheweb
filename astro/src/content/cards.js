const cardIndex = [
	// 'adrenaline',
	// 'bash',
	// 'bludgeon',
	// 'bodySlam',
	// 'clash',
	// 'cleave',
	// 'defend',
	// 'flourish',
	// 'intimidate',
	// 'ironWave',
	// 'maskOfTheFaceless',
	// 'pommelStrike',
	// 'ritualRain',
	// 'soulDrain',
	// 'strike',
	// 'succube',
	// 'suckerPunch',
	// 'summerOfSam',
	// 'terror',
	// 'thunderclap',
	// 'voodooEducation',
	'adrenaline',
	'bash',
	'bludgeon',
	'body-slam',
	'clash',
	'cleave',
	'defend',
	'flourish',
	'intimidate',
	'iron-wave',
	'mask-of-the-faceless',
	'pommel-strike',
	'ritual-rain',
	'soul-drain',
	'strike',
	'succube',
	'sucker-punch',
	'summer-of-sam',
	'terror',
	'thunderclap',
	'voodoo-education',
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

// Use Vite's glob import to import all cards.
// const modules = import.meta.glob('./cards/*.js', {eager: true})

// Fill out the cards and upgrades maps.
// for (const module of Object.values(modules)) {
for (const fileName of cardIndex) {
	const module = await import(`./cards/${fileName}.js`)
	// cards[module.default.name] = module.default
	cards.push(module.default)
	cardUpgrades[module.default.name] = module.upgrade
}

// for (const card of cardIndex) {
// 	const module = await import(`./cards/${card.name}.js`)
// 	console.log(card, module)
// 	// cards[card.name] = module.default
// 	// upgrades[card.name] = module.upgrade
// }

// adrenaline,
// bash,
// bludgeon,
// bodySlam,
// clash,
// cleave,
// defend,
// flourish,
// intimidate,
// ironWave,
// maskOfTheFaceless,
// pommelStrike,
// ritualRain,
// soulDrain,
// strike,
// succube,
// suckerPunch,
// summerOfSam,
// terror,
// thunderclap,
// voodooEducation,
// ]

// import adrenaline, {upgrade as upgradeAdrenaline} from './cards/adrenaline.js'
// import bash, {upgrade as upgradeBash} from './cards/bash.js'
// import bludgeon, {upgrade as upgradeBludgeon} from './cards/bludgeon.js'
// import bodySlam, {upgrade as upgradeBodySlam} from './cards/body-slam.js'
// import clash, {upgrade as upgradeClash} from './cards/clash.js'
// import cleave, {upgrade as upgradeCleave} from './cards/cleave.js'
// import defend, {upgrade as upgradeDefend} from './cards/defend.js'
// import flourish, {upgrade as upgradeFlourish} from './cards/flourish.js'
// import intimidate, {upgrade as upgradeIntimidate} from './cards/intimidate.js'
// import ironWave, {upgrade as upgradeIronWave} from './cards/iron-wave.js'
// import maskOfTheFaceless, {
// 	upgrade as upgradeMaskOfTheFaceless,
// } from './cards/mask-of-the-faceless.js'
// import pommelStrike, {upgrade as upgradePommelStrike} from './cards/pommel-strike.js'
// import ritualRain, {upgrade as upgradeRitualRain} from './cards/ritual-rain.js'
// import soulDrain, {upgrade as upgradeSoulDrain} from './cards/soul-drain.js'
// import strike, {upgrade as upgradeStrike} from './cards/strike.js'
// import succube, {upgrade as upgradeSuccube} from './cards/succube.js'
// import suckerPunch, {upgrade as upgradeSuckerPunch} from './cards/sucker-punch.js'
// import summerOfSam, {upgrade as upgradeSummerOfSam} from './cards/summer-of-sam.js'
// import terror, {upgrade as upgradeTerror} from './cards/terror.js'
// import thunderclap, {upgrade as upgradeThunderclap} from './cards/thunderclap.js'
// import voodooEducation, {upgrade as upgradeVoodooEducation} from './cards/voodoo-education.js'

// const cardModules = import.meta.glob('../content/cards/*.js', {eager: true})
// console.log(cardModules)
// const cards = Object.entries(cardModules).map([key, module] => {
// })
