import {driver} from 'driver.js'
import 'driver.js/dist/driver.css'

export default function startTutorial() {
	console.log('now intro tutorial')

	const steps = [
		{
			popover: {title: 'Tutorial', description: 'Let me show you around.'},
		},
		{
			element: '.Target[data-type="player"]',
			popover: {align: 'center', description: 'This is you. Try not to lose your health.'},
		},
		{
			element: '.EnergyBadge',
			popover: {description: 'Playing cards cost energy. Energy refreshes every turn.'},
		},
		{
			element: '.Hand .Cards',
			popover: {align: 'center', description: 'These are the cards you can play.'},
		},
		{
			element: '.EndTurn',
			popover: {description: 'Ending your turn, the monster(s) will take turn.'},
		},
	]
	const enemies = document.querySelectorAll('.Target[data-type="enemy"]')
	enemies.forEach((target) => {
		steps.push({
			element: target,
			popover: {align: 'center', position: 'left', description: 'This is an enemy. Throw cards at it until it dies.'},
		})
	})
	steps.push({popover: {description: 'The rest you must figure out yourself. Good luck!'}})

	const intro = driver({allowClose: false, steps})
	intro.drive()
}
