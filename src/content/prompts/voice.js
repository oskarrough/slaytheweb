// Shared aesthetic voice for all Slay the Web generated imagery.
// The uncanny as infrastructure. Things that are too deliberate to be natural,
// too old to be remembered, too present to be discussed.

export const voice = {
	// Core directives that apply to all generations
	mood: 'mystical and ominous, never heroic. the weird as municipal fact, not spectacle.',
	inhabitants: 'tiny figures going about their lives, unbothered by what surrounds them. they have always lived here.',
	negative: 'no text, no UI elements, no modern objects, no explained magic, no centered conflict.',

	// The relationship between viewer and subject
	stance: 'observational distance, as if documenting something that predates the observer. encyclopedic detachment.',

	// What makes something feel like Slay the Web
	signature: [
		'things that are too smooth, too regular, too deliberate for geology or chance',
		'architecture as aftermath—built around, into, or from something older',
		'the numinous treated as local inconvenience or seasonal weather',
		'specificity without explanation: we know the customs, not the reasons',
	],
}

// Compose voice into a prompt fragment
export function voiceFragment() {
	return `${voice.mood} ${voice.stance} ${voice.negative}`
}
