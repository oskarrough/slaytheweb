const audioContext = new (window.AudioContext || window.webkitAudioContext)()

/**
 * Plays a beep sound using web audio api
 * AudioContext > Oscillator -> Gain
 */
export function beep(
	startFrequency = 440,
	endFrequency = 880,
	duration = 0.5,
	waveform = 'square',
	volume = 0.1,
) {
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

const majorScale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5] // C5, D5, E5, F5, G5, A5, B5, C6
const minorScale = [440.0, 523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77] // A4, C5, D5, E5, F5, G5, A5, B5
const pentatonicScale = [523.25, 659.25, 783.99, 880.0, 1046.5] // C5, E5, G5, A5, C6

/**
 * Plays a coin/reward high pitched sound
 */
export function playCoin(type, volume = 0.5) {
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

export function playWhoosh(duration = 1, startFreq = 200, endFreq = 800, volume = 0.2) {
	const audioContext = new (window.AudioContext || window.webkitAudioContext)()

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
