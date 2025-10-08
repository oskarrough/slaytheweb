import {html} from '../lib.js'
import {Monster} from './player.js'

export function MonsterRoster({tiers}) {
	function createStaticGameState() {
		return {
			player: {
				powers: {vulnerable: 0, weak: 0, strength: 0, poison: 0, regen: 0},
			},
		}
	}

	return html`
		<div class="monster-roster">
			${tiers.map((tier) => {
				const encounters = Object.entries(tier.data)
				return html`
					<section list>
						<h2>${tier.name}</h2>
						<div>
							${encounters.map(([encounterName, room]) => {
								const monstersInRoom = room.monsters
								return html`
									<article>
										<h3>${encounterName}</h3>
										<section grid>
											${monstersInRoom.map(
												(monster) =>
													html`<${Monster}
														model=${monster}
														gameState=${createStaticGameState()}
													/>`,
											)}
										</section>
									</article>
								`
							})}
						</div>
					</section>
				`
			})}
		</div>
	`
}
