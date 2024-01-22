import {driver} from 'driver.js'
import 'driver.js/dist/driver.css'

export default function startTutorial() {
	const steps = [
		{
			popover: {
				title: 'Greetings',
				description: 'This is a very short introduction to Slay the Web. Follow me... (press enter)',
			},
		},
		{
			element: '.Target[data-type="player"]',
			popover: {align: 'center', description: 'This is you. Try not to lose all your health.'},
		},
		{
			element: '.Hand .Cards',
			popover: {align: 'center', description: 'You have drawn 5 cards. Playing cards cost energy.'},
		},
		{
			element: '.EnergyBadge',
			popover: {description: 'You have 3 energy. It refreshes every turn.'},
		},
		{
			element: '.EndTurn',
			popover: {description: 'Ending your turn will allow the monster(s) to do their thing.'},
		},
	]
	const enemies = document.querySelectorAll('.Target[data-type="enemy"]')
	enemies.forEach((target) => {
		steps.push({
			element: target,
			popover: {
				align: 'center',
				position: 'left',
				description: 'This is an enemy. Throw cards at it until it dies.',
			},
		})
	})
	steps.push({popover: {description: 'The rest you must figure out yourself. Good luck!'}})

	const intro = driver({allowClose: false, nextBtnText: 'OK', showButtons: ['next'], steps})
	intro.drive()
}
