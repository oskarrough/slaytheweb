// import * as Tone from 'tone'

// // Create synths and connect it to the main output (your speakers).
// const polySynth = new Tone.PolySynth(Tone.AMSynth, {volume: -36}).toDestination()
// const amSynth = new Tone.AMSynth({volume: -14}).toDestination()

// Tone.start()

// function startGame() {
// 	polySynth.triggerAttackRelease(['D4', 'F4', 'A4', 'C5', 'E5'], 0.7)
// }

// const selectCard = () => {
// 	// initialize the noise and start
// 	const noise = new Tone.Noise({
// 		type: 'brown',
// 		fadeOut: 0.07,
// 		volume: -33,
// 	}).start()

// 	// make an autofilter to shape the noise
// 	const autoFilter = new Tone.AutoFilter({
// 		frequency: '5n',
// 		baseFrequency: 3000,
// 		octaves: 2,
// 	})
// 		.toDestination()
// 		.start()
// 	autoFilter.stop('+0.1')

// 	// connect the noise
// 	noise.connect(autoFilter)
// 	// start the autofilter LFO
// 	noise.stop('+0.04')
// }

// function endTurn() {
// 	// initialize the noise and start
// 	const noise = new Tone.Noise({
// 		type: 'pink',
// 		fadeOut: 0.2,
// 		volume: -28,
// 	}).start()

// 	// make an autofilter to shape the noise
// 	const autoFilter = new Tone.AutoFilter({
// 		frequency: '2n',
// 		baseFrequency: 200,
// 		octaves: 2,
// 	})
// 		.toDestination()
// 		.start()
// 	autoFilter.stop('+0.4')

// 	// connect the noise
// 	noise.connect(autoFilter)
// 	// start the autofilter LFO
// 	noise.stop('+0.2')
// }

// function startTurn() {
// 	/* synth.triggerAttackRelease('C4', '8n') */

// 	// initialize the noise and start
// 	const noise = new Tone.Noise({
// 		type: 'pink',
// 		fadeOut: 0.4,
// 		volume: -33,
// 	}).start()

// 	// make an autofilter to shape the noise
// 	const autoFilter = new Tone.AutoFilter({
// 		frequency: '2n',
// 		baseFrequency: 800,
// 		octaves: 1,
// 	})
// 		.toDestination()
// 		.start()
// 	autoFilter.stop('+0.25')

// 	// connect the noise
// 	noise.connect(autoFilter)
// 	// start the autofilter LFO
// 	noise.stop('+0.3')
// }

// function cardToHand() {
// 	// initialize the noise and start
// 	const noise = new Tone.Noise({
// 		type: 'pink',
// 		fadeOut: 0.1,
// 		volume: -35,
// 	}).start()

// 	// make an autofilter to shape the noise
// 	const autoFilter = new Tone.AutoFilter({
// 		frequency: '2n',
// 		baseFrequency: 1000,
// 		octaves: 1,
// 	})
// 		.toDestination()
// 		.start()
// 	autoFilter.stop('+0.08')

// 	// connect the noise
// 	noise.connect(autoFilter)
// 	// start the autofilter LFO
// 	noise.stop('+0.1')
// }

// function playCard({card}) {
// 	const cardType = card.damage ? 'attack' : 'defense'
// 	if (cardType === 'attack') {
// 		playAttackCard()
// 	}
// 	if (cardType === 'defense') {
// 		playDefenseCard()
// 	}
// }

// const playAttackCard = () => {
// 	amSynth.triggerAttackRelease('G#3', 0.2)
// }

// const playDefenseCard = () => {
// 	amSynth.triggerAttackRelease('G#2', 0.02)
// }

// export default {
// 	startGame,
// 	startTurn,
// 	endTurn,
// 	selectCard,
// 	cardToHand,
// 	playCard,
// }
