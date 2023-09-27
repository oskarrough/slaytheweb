import {html} from '../lib.js'

export default function DungeonStats({dungeon}) {
	const stats = getEnemiesStats(dungeon)
	return html`
		<h2>Dungeon stats</h2>
		<ul>
			<li>Enemies encountered: ${stats.encountered}</li>
			<li>Enemies killed: ${stats.killed}</li>
			<li>Total enemies health: ${stats.maxHealth}</li>
			<li>Final health count: ${stats.finalHealth}</li>
		</ul>
	`
}

const getEnemiesStats = (dungeon) => {
	const stats = {
		killed: 0,
		encountered: 0,
		maxHealth: 0,
		finalHealth: 0,
	}
	/* for each path taken (room) in the dungeon, get some stats */
	dungeon.pathTaken.forEach((usedNode) => {
		const nodeData = dungeon.graph[usedNode.y][usedNode.x]
		/* find some stats about the enemies encountered */
		if (nodeData.room?.monsters) {
			/* how many encountered monsters */
			stats.encountered += nodeData.room.monsters.length
			nodeData.room.monsters.forEach((monster) => {
				/* how many killed monsters? */
				if (monster.currentHealth <= 0) {
					stats.killed += 1
				}
				/* monsters total life */
				stats.finalHealth += monster.currentHealth
				stats.maxHealth += monster.maxHealth
			})
		}
	})
	return stats
}
