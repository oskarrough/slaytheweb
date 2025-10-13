import test from 'ava'
import createNewGame from '../../src/game/new-game.js'
import {encode} from '../../src/ui/save-load.js'

test('analyze monster data contribution to save size', (t) => {
	const game = createNewGame()

	// get full save size
	const fullSave = encode(game)
	const fullSize = new Blob([fullSave]).size
	console.log(`\nfull game save: ${fullSize} bytes`)

	// measure dungeon size
	const dungeonOnly = encode(game.state.dungeon)
	const dungeonSize = new Blob([dungeonOnly]).size
	console.log(`dungeon: ${dungeonSize} bytes (${((dungeonSize / fullSize) * 100).toFixed(1)}%)`)

	// count rooms with monsters
	let monsterRoomCount = 0
	let totalMonsters = 0
	game.state.dungeon.graph.forEach((floor) => {
		floor.forEach((node) => {
			if (node.room?.monsters) {
				monsterRoomCount++
				totalMonsters += node.room.monsters.length
			}
		})
	})
	console.log(`\nrooms with monsters: ${monsterRoomCount}`)
	console.log(`total monster instances: ${totalMonsters}`)

	// sample a single monster to see its size
	const sampleMonster = game.state.dungeon.graph
		.flat()
		.find((node) => node.room?.monsters)?.room.monsters[0]

	if (sampleMonster) {
		const monsterSize = new Blob([encode(sampleMonster)]).size
		console.log(`\nsingle monster serialized: ${monsterSize} bytes`)

		// break down monster structure
		console.log('\nmonster structure:')
		console.log(`  name: ${sampleMonster.name}`)
		console.log(`  sprite: ${JSON.stringify(sampleMonster.sprite)}`)
		console.log(`  intents array length: ${sampleMonster.intents.length}`)
		console.log(`  intents size: ${new Blob([encode(sampleMonster.intents)]).size} bytes`)

		// estimate total monster data
		const estimatedMonsterData = monsterSize * totalMonsters
		console.log(
			`\nestimated all monsters: ${estimatedMonsterData} bytes (${((estimatedMonsterData / fullSize) * 100).toFixed(1)}% of save)`,
		)
		console.log(
			`estimated intents only: ${new Blob([encode(sampleMonster.intents)]).size * totalMonsters} bytes`,
		)
	}

	// test stripping intents
	console.log('\n--- if we strip intents ---')
	const dungeonCopy = JSON.parse(JSON.stringify(game.state.dungeon))
	dungeonCopy.graph.forEach((floor) => {
		floor.forEach((node) => {
			if (node.room?.monsters) {
				node.room.monsters.forEach((monster) => {
					delete monster.intents
				})
			}
		})
	})
	const strippedSize = new Blob([encode(dungeonCopy)]).size
	const savings = dungeonSize - strippedSize
	console.log(`dungeon without intents: ${strippedSize} bytes`)
	console.log(`savings: ${savings} bytes (${((savings / dungeonSize) * 100).toFixed(1)}% of dungeon)`)
	console.log(`savings: ${((savings / fullSize) * 100).toFixed(1)}% of total save`)

	t.pass()
})
