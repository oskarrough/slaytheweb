import test from 'ava'
import {createTestDungeon} from '../src/content/dungeons.js'
import actions from '../src/game/actions.js'
import {isCurrRoomCompleted, isDungeonCompleted, getCurrRoom} from '../src/game/utils-state.js'

const a = actions

test('can complete entire dungeon from start to finish', (t) => {
	let state = a.createNewState()
	const dungeon = createTestDungeon()
	state = a.setDungeon(state, dungeon)
	state = a.addStarterDeck(state)
	state = a.drawCards(state)

	t.is(state.dungeon.y, 0)
	t.is(state.dungeon.x, 0)

	const totalFloors = dungeon.graph.length

	for (let floorIndex = 1; floorIndex < totalFloors; floorIndex++) {
		state = a.move(state, {move: {x: 0, y: floorIndex}})
		t.is(state.dungeon.y, floorIndex)

		const room = getCurrRoom(state)

		if (room.type === 'monster') {
			t.true(room.monsters.length > 0)

			let turnCount = 0
			const maxTurns = 100

			while (!isCurrRoomCompleted(state) && turnCount < maxTurns) {
				while (state.hand.length > 0 && state.player.currentEnergy > 0) {
					const card = state.hand.find((c) => c.energy <= state.player.currentEnergy)
					if (!card) break

					const currentRoom = getCurrRoom(state)
					const aliveMonsterIndex = currentRoom.monsters.findIndex((m) => m.currentHealth > 0)
					if (aliveMonsterIndex === -1) break

					const target = card.target === 'player' ? 'player' : `enemy${aliveMonsterIndex}`
					state = a.playCard(state, {card, target})
				}

				state = a.endTurn(state)
				turnCount++

				if (state.player.currentHealth <= 0) {
					t.fail(`Player died on floor ${floorIndex} after ${turnCount} turns`)
					return
				}
			}

			t.true(isCurrRoomCompleted(state))
			t.true(turnCount < maxTurns)

			const currentRoom = getCurrRoom(state)
			const deadMonsters = currentRoom.monsters.filter((m) => m.currentHealth <= 0)
			t.is(deadMonsters.length, currentRoom.monsters.length)
		}
	}

	t.true(isDungeonCompleted(state))
	t.is(state.dungeon.y, totalFloors - 1)
	t.true(state.dungeon.paths.length > 0)
	t.true(state.player.currentHealth > 0)
})

test('validates path integrity at boss room', (t) => {
	let state = a.createNewState()
	const dungeon = createTestDungeon()
	state = a.setDungeon(state, dungeon)
	state = a.addStarterDeck(state)
	state = a.drawCards(state)

	const bossFloorIndex = dungeon.graph.length - 1

	for (let y = 1; y < dungeon.graph.length; y++) {
		state = a.move(state, {move: {x: 0, y}})
		const room = getCurrRoom(state)

		if (room.type === 'monster') {
			room.monsters.forEach((monster, idx) => {
				state = a.setHealth(state, {target: `enemy${idx}`, amount: 0})
			})
		}

		if (y === bossFloorIndex) {
			const bossNode = state.dungeon.graph[bossFloorIndex][0]
			t.is(bossNode.edges.size, 0)
			t.true(state.dungeon.paths.length > 0)
			t.true(Array.isArray(state.dungeon.paths))
			state.dungeon.paths.forEach((path, idx) => {
				t.true(Array.isArray(path), `path ${idx} should be an array`)
			})
		}
	}

	t.true(isDungeonCompleted(state))
})
