export default function startTutorial() {
	console.log('now intro tutorial')
	var intro = window.introJs().setOptions({
		hidePrev: true,
		exitOnEsc: false,
		exitOnOverlayClick: false,
		// showButtons: false,
		showBullets: false,
		scrollToElement: false,
		buttonClass: 'Button',
		steps: [
			{
				intro: 'Let me show you around.',
			},
			{
				element: document.querySelector('.Target[data-type="player"]'),
				intro: 'This is you. You have health. And block.',
			},
			{
				element: document.querySelector('.Hand .Cards'),
				intro: 'These are the cards you can play.',
				position: 'top',
			},
			{
				element: document.querySelector('.EnergyBadge'),
				intro: 'This is your energy. It refreshes every turn.',
				position: 'right',
			},
			{
				element: document.querySelector('.EndTurn'),
				intro: 'Ending your turn will allow the monsters to take theirs.',
			},
			{
				element: document.querySelector('.EndTurn'),
				intro: 'Once they are done. You will draw a new hand of cards.',
			},
		],
	})

	const enemies = document.querySelectorAll('.Target[data-type="enemy"]')
	enemies.forEach((target) => {
		intro.addStep({
			element: target,
			intro: 'This is an enemy. Throw cards at it until it dies.',
		})
	})

	intro.addStep({
		intro: 'The rest you must figure out yourself. Good luck!',
	})

	// intro.addStep({
	// 	element: document.querySelector('#Map > button'),
	// 	intro: 'This is your map. Open it.',
	// })
	// intro.addStep({
	// 	element: document.querySelector('#Deck > button'),
	// 	intro: 'All the cards in your deck',
	// })
	// intro.addStep({
	// 	element: document.querySelector('#DrawPile > button'),
	// 	intro: 'You draw cards from here. When empty, your discard pile will be reshuffled into your draw pile.',
	// })
	// intro.addStep({
	// 	element: document.querySelector('#DiscardPile > button'),
	// 	intro:
	// 		'Cards you have played. When your draw pile is empty, these will be reshuffled into your draw pile.',
	// })
	// intro.addStep({
	// 	element: document.querySelector('#Menu > button'),
	// 	intro: 'In the menu you can toggle the sounds & save your game',
	// })

	intro.start()
}
