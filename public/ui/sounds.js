import * as Tone from '../web_modules/tone.js'

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination()
const polySynth = new Tone.PolySynth(Tone.AMSynth).toDestination()

// export const playSoundFromCard = (card) => {
// 	synth.triggerAttackRelease('C4', '8n')
// }

Tone.start()

function startGame() {
	const now = Tone.now()
	// polySynth.triggerAttack('D4', now)
	// polySynth.triggerAttack('F4', now + 0.5)
	// polySynth.triggerAttack('A4', now + 1)
	// polySynth.triggerAttack('C5', now + 1.5)
	// polySynth.triggerAttack('E5', now + 2)
	polySynth.triggerRelease(['D4', 'F4', 'A4', 'C5', 'E5'], now + 4)
	// polySynth.triggerRelease(['D4', 'F4', 'A4', 'C5', 'E5'])
}

const selectCard = async () => {
	// initialize the noise and start
	const noise = new Tone.Noise({
		type: 'brown',
		fadeOut: 0.07,
		volume: -33
	}).start();

	// make an autofilter to shape the noise
	const autoFilter = new Tone.AutoFilter({
		frequency: "5n",
		baseFrequency: 3000,
		octaves: 2
	}).toDestination().start()
	autoFilter.stop("+0.1")

	// connect the noise
	noise.connect(autoFilter)
	// start the autofilter LFO
	noise.stop("+0.04")
}

function endTurn() {
	/* synth.triggerAttackRelease('C4', '8n') */

	// initialize the noise and start
	const noise = new Tone.Noise({
		type: 'pink',
		fadeOut: 0.2,
		volume: -28
	}).start();

	// make an autofilter to shape the noise
	const autoFilter = new Tone.AutoFilter({
		frequency: "2n",
		baseFrequency: 200,
		octaves: 2
	}).toDestination().start()
	autoFilter.stop("+0.4")

	// connect the noise
	noise.connect(autoFilter)
	// start the autofilter LFO
	noise.stop("+0.2")
}

function startTurn() {
	/* synth.triggerAttackRelease('C4', '8n') */

	// initialize the noise and start
	const noise = new Tone.Noise({
		type: 'pink',
		fadeOut: 0.4,
		volume: -33
	}).start();

	// make an autofilter to shape the noise
	const autoFilter = new Tone.AutoFilter({
		frequency: "2n",
		baseFrequency: 800,
		octaves: 1
	}).toDestination().start()
	autoFilter.stop("+0.25")

	// connect the noise
	noise.connect(autoFilter)
	// start the autofilter LFO
	noise.stop("+0.3")
}

function cardToHand() {
	/* synth.triggerAttackRelease('C4', '8n') */

	// initialize the noise and start
	const noise = new Tone.Noise({
		type: 'pink',
		fadeOut: 0.1,
		volume: -35
	}).start();

	// make an autofilter to shape the noise
	const autoFilter = new Tone.AutoFilter({
		frequency: "2n",
		baseFrequency: 1000,
		octaves: 1
	}).toDestination().start()
	autoFilter.stop("+0.08")

	// connect the noise
	noise.connect(autoFilter)
	// start the autofilter LFO
	noise.stop("+0.1")
}

export default {
	startGame,
	startTurn,
	endTurn,
	selectCard,
	cardToHand,
}
