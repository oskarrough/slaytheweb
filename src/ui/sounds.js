// @ts-nocheck
import * as Tone from 'tone'

// Create synths and connect it to the main output (your speakers).
const polySynth = new Tone.PolySynth(Tone.AMSynth, {volume: -20}).toDestination()
const amSynth = new Tone.AMSynth({volume: -10}).toDestination()

export async function init() {
	await Tone.start()
	console.log('Sound initialized')
}

function startGame() {
	polySynth.triggerAttackRelease(['D4', 'F4', 'A4', 'C5', 'E5'], '4n')
}

function startTurn() {
	// initialize the noise and start
	const noise = new Tone.Noise({
		type: 'pink',
		fadeOut: 0.4,
		volume: -20,
	}).start()

	// make an autofilter to shape the noise
	const autoFilter = new Tone.AutoFilter({
		frequency: '2n',
		baseFrequency: 800,
		octaves: 1,
	})
		.toDestination()
		.start()
	autoFilter.stop('+0.25')

	// connect the noise
	noise.connect(autoFilter)
	// start the autofilter LFO
	noise.stop('+0.3')
}

function endTurn() {
	const pinkNoise = new Tone.Noise({
		type: 'pink',
		fadeOut: 0.2,
		volume: -28,
	})

	pinkNoise.start()
	const autoFilter = new Tone.AutoFilter({
		frequency: '2n',
		// baseFrequency: 200,
		octaves: 4,
		volume: -10,
	})
		.toDestination()
		.start()
		.stop('+0.4')
	pinkNoise.connect(autoFilter).stop('+0.3')
}

function cardToHand() {
	// initialize the noise and start
	const noise = new Tone.Noise({
		type: 'pink',
		fadeOut: 0.1,
		volume: -20,
	}).start()

	// make an autofilter to shape the noise
	const autoFilter = new Tone.AutoFilter({
		frequency: '2n',
		baseFrequency: 1000,
		octaves: 1,
	})
		.toDestination()
		.start()
		.stop('+0.08')

	// connect the noise
	noise
		.connect(autoFilter)
		// start the autofilter LFO
		.stop('+0.1')
}

const selectCard = () => {
	amSynth.triggerAttackRelease('C4', '8n')
}

function playCard(card) {
	amSynth.triggerAttackRelease('G#3', '16n')
}

export const toggleMute = (shouldMute) => {
	Tone.Destination.mute = shouldMute
}

export default {
	startGame,
	startTurn,
	endTurn,
	selectCard,
	cardToHand,
	playCard,
}
