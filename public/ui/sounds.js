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

function selectCard() {
	// const reverb = new Tone.Reverb(0.1).toDestination()
	synth.triggerAttackRelease('A4', 0.4)
}

function endTurn() {
	synth.triggerAttackRelease('C4', '8n')
}

export default {
	startGame,
	selectCard,
	endTurn,
}
