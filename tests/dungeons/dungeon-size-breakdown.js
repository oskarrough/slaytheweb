import test from 'ava'
import {createDefaultDungeon} from '../../src/content/dungeons.js'
import {encode} from '../../src/ui/save-load.js'

test('analyze dungeon structure in detail', (t) => {
	const dungeon = createDefaultDungeon()

	const height = dungeon.graph.length
	const width = dungeon.graph[1]?.length || 0

	console.log('\n=== DUNGEON STRUCTURE ANALYSIS ===\n')
	console.log(`Grid dimensions: ${width}x${height}`)
	console.log(`Total nodes: ${width * height}`)
	console.log(`Paths: ${dungeon.paths.length}`)

	// count rooms by type
	let monsterRooms = 0
	let campfireRooms = 0
	let emptyNodes = 0
	let totalMonsters = 0
	let totalIntents = 0

	dungeon.graph.forEach((floor) => {
		floor.forEach((node) => {
			if (!node.room) {
				emptyNodes++
			} else if (node.room.type === 'monster') {
				monsterRooms++
				totalMonsters += node.room.monsters.length
				node.room.monsters.forEach((monster) => {
					totalIntents += monster.intents.length
				})
			} else if (node.room.type === 'campfire') {
				campfireRooms++
			}
		})
	})

	console.log(`\nRoom breakdown:`)
	console.log(`  Empty nodes: ${emptyNodes}`)
	console.log(`  Monster rooms: ${monsterRooms}`)
	console.log(`  Campfire rooms: ${campfireRooms}`)
	console.log(`  Total monsters: ${totalMonsters}`)
	console.log(`  Total intents: ${totalIntents}`)

	// measure sizes of different parts
	const sizes = {
		full: new Blob([encode(dungeon)]).size,
		graph: new Blob([JSON.stringify(dungeon.graph)]).size,
		paths: new Blob([JSON.stringify(dungeon.paths)]).size,
	}

	console.log(`\nSize breakdown:`)
	console.log(`  Full dungeon: ${(sizes.full / 1024).toFixed(2)} KB`)
	console.log(`  Graph: ${(sizes.graph / 1024).toFixed(2)} KB (${((sizes.graph / sizes.full) * 100).toFixed(1)}%)`)
	console.log(`  Paths: ${(sizes.paths / 1024).toFixed(2)} KB (${((sizes.paths / sizes.full) * 100).toFixed(1)}%)`)

	// look at a sample monster
	const sampleMonsterRoom = dungeon.graph.flat().find((node) => node.room?.type === 'monster')
	if (sampleMonsterRoom) {
		const monster = sampleMonsterRoom.room.monsters[0]
		console.log(`\nSample monster:`)
		console.log(`  HP: ${monster.maxHealth}`)
		console.log(`  Intents: ${monster.intents.length}`)
		console.log(`  Intent data: ${JSON.stringify(monster.intents[0])}`)
		console.log(`  Full monster size: ${new Blob([JSON.stringify(monster)]).size} bytes`)
		console.log(`  Intents size: ${new Blob([JSON.stringify(monster.intents)]).size} bytes`)
	}

	t.pass()
})
