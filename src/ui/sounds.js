// Here's you will find all the sound effects used in the game.
// They are made using the Web Audio API.
let audioContext

// Global mute control
let isMuted = false

// Note frequency mapping for musical notes
const noteToFreq = {
	C4: 261.63,
	'G#3': 207.65,
	D4: 293.66,
	F4: 349.23,
	A4: 440.0,
	C5: 523.25,
	E5: 659.25,
}

// Scale definitions for musical sequences
const majorScale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5] // C5, D5, E5, F5, G5, A5, B5, C6
const minorScale = [440.0, 523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77] // A4, C5, D5, E5, F5, G5, A5, B5
const pentatonicScale = [523.25, 659.25, 783.99, 880.0, 1046.5] // C5, E5, G5, A5, C6

// Initialize audio context
export async function init() {
	if (!audioContext) {
		try {
			audioContext = new window.AudioContext()
		} catch (error) {
			console.error('Failed to create audio context:', error)
		}
	}
	return Promise.resolve()
}

// Simple function to play a beep sound
export function simpleBeep(frequency = 440, duration = 0.2, volume = 0.3, type = 'sine') {
	if (!audioContext) init()
	if (isMuted) return
	const oscillator = audioContext.createOscillator()
	oscillator.type = type
	oscillator.frequency.value = frequency

	const gainNode = audioContext.createGain()
	gainNode.gain.value = volume

	// Create envelope
	gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
	gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

	oscillator.connect(gainNode)
	gainNode.connect(audioContext.destination)

	oscillator.start()
	oscillator.stop(audioContext.currentTime + duration)
}

/**
 * Plays a beep sound with frequency modulation
 */
export function beep(startFrequency = 440, endFrequency = 880, duration = 0.5, waveform = 'square', volume = 0.1) {
	if (!audioContext) init()
	if (isMuted) return
	const oscillator = audioContext.createOscillator()
	oscillator.type = waveform // 'square', 'sawtooth', 'triangle', or 'sine'
	oscillator.frequency.setValueAtTime(startFrequency, audioContext.currentTime)

	if (endFrequency && duration > 0) {
		oscillator.frequency.exponentialRampToValueAtTime(endFrequency, audioContext.currentTime + duration)
	}

	// Adding a simple gain envelope for a more "blippy" sound
	const gainNode = audioContext.createGain()
	gainNode.gain.setValueAtTime(0, audioContext.currentTime)
	gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01) // Quick ramp up
	gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration) // And down

	oscillator.connect(gainNode)
	gainNode.connect(audioContext.destination)

	oscillator.start()
	oscillator.stop(audioContext.currentTime + duration)
}

/**
 * Plays a coin/reward high pitched sound
 */
export function playCoin(type, volume = 0.5) {
	if (!audioContext) init()
	if (isMuted) return

	const scales = [majorScale, minorScale, pentatonicScale]
	let selectedScale = scales[Math.floor(Math.random() * scales.length)]
	if (type === 'major') selectedScale = majorScale
	if (type === 'minor') selectedScale = minorScale
	if (type === 'pentatonic') selectedScale = pentatonicScale

	selectedScale.forEach((note, index) => {
		setTimeout(() => {
			beep(note, note, 0.1, 'triangle', volume)
		}, index * 100)
	})
}

export function simpleFilteredNoise(type = 'pink', duration = 0.3, filterFreq = 800, volume = 0.2) {
	if (!audioContext) init()
	if (isMuted) return

	// console.log(`Playing filtered noise: ${type}, ${duration}s, filter:${filterFreq}Hz, vol:${volume}`)

	// Create buffer for noise
	const bufferSize = audioContext.sampleRate * duration
	const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
	const output = noiseBuffer.getChannelData(0)

	// Fill buffer with noise
	if (type === 'pink') {
		let b0 = 0,
			b1 = 0,
			b2 = 0,
			b3 = 0,
			b4 = 0,
			b5 = 0,
			b6 = 0

		for (let i = 0; i < bufferSize; i++) {
			const white = Math.random() * 2 - 1
			b0 = 0.99886 * b0 + white * 0.0555179
			b1 = 0.99332 * b1 + white * 0.0750759
			b2 = 0.969 * b2 + white * 0.153852
			b3 = 0.8665 * b3 + white * 0.3104856
			b4 = 0.55 * b4 + white * 0.5329522
			b5 = -0.7616 * b5 - white * 0.016898
			output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
			output[i] *= 0.11 // Scale to make -1 to 1 range
		}
	} else {
		// White noise
		for (let i = 0; i < bufferSize; i++) {
			output[i] = Math.random() * 2 - 1
		}
	}

	// Create noise source
	const noiseSource = audioContext.createBufferSource()
	noiseSource.buffer = noiseBuffer

	// Create filter
	const filter = audioContext.createBiquadFilter()
	filter.type = 'bandpass'
	filter.frequency.value = filterFreq
	filter.Q.value = 1

	// Create gain node for volume control
	const gainNode = audioContext.createGain()
	gainNode.gain.value = volume

	// Create envelope
	gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
	gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

	// Connect nodes
	noiseSource.connect(filter)
	filter.connect(gainNode)
	gainNode.connect(audioContext.destination)

	noiseSource.start()
}

/**
 * Plays a whoosh sound effect
 */
export function playWhoosh(duration = 1, startFreq = 200, endFreq = 800, volume = 0.2) {
	if (!audioContext) init()

	// Sine wave oscillator
	const oscillator = audioContext.createOscillator()
	oscillator.type = 'sine'
	oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime)
	oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + duration)

	// Gain envelope for smooth fade-in and fade-out
	const gainNode = audioContext.createGain()
	gainNode.gain.setValueAtTime(0, audioContext.currentTime)
	gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + duration * 0.2)
	gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)

	oscillator.connect(gainNode)
	gainNode.connect(audioContext.destination)

	oscillator.start()
	oscillator.stop(audioContext.currentTime + duration)
}

export function startGame() {
	if (!audioContext) init()

	// Play a chord with slight delays to avoid timing issues
	const notes = ['D4', 'F4', 'A4', 'C5', 'E5']
	notes.forEach((note, index) => {
		setTimeout(() => {
			simpleBeep(noteToFreq[note], 0.25, 0.03)
		}, index * 16) // 16ms delay between notes
	})
}

export function startTurn() {
	if (!audioContext) init()
	simpleFilteredNoise('pink', 0.3, 800, 0.5)
}

export function endTurn() {
	if (!audioContext) init()
	simpleFilteredNoise('pink', 0.3, 400, 0.3)
}

export function cardToHand() {
	if (!audioContext) init()
	simpleFilteredNoise('pink', 0.1, 1000, 0.3)
}

export function selectCard() {
	if (!audioContext) init()
	simpleBeep(noteToFreq.C4, 0.125, 0.1)
}

export function playCard(/*card*/) {
	if (!audioContext) init()
	simpleBeep(noteToFreq['G#3'], 0.0625, 0.3)
}

export const toggleMute = (shouldMute) => {
	isMuted = shouldMute
}
