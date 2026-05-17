import {voiceFragment} from './voice.js'

export const template = `{style} of {subject}, {type}, {mood}. ${voiceFragment()} White background, circular vignette frame, monochrome, antiquarian book illustration.`

export const categories = [
	{
		key: 'type',
		label: 'card type',
		options: [
			{name: 'attack', desc: 'the moment before contact, when the air already knows'},
			{name: 'skill', desc: 'potential held in suspension, a breath not yet released'},
			{name: 'power', desc: 'a gesture held so long it became permanent'},
			{name: 'status', desc: 'something wrong at the edges, spreading inward'},
		],
	},
	{
		key: 'subject',
		label: 'subject',
		options: [
			{name: 'blade', desc: 'a blade older than its wielder, patient'},
			{name: 'hand', desc: 'fingers arranged in a configuration that means something'},
			{name: 'creature', desc: 'something that was here before the village'},
			{name: 'force', desc: 'pressure made visible, the shape of intention'},
			{name: 'eye', desc: 'an eye that has seen too much and forgotten none of it'},
			{name: 'vessel', desc: 'a container for something that should not be contained'},
			{name: 'root', desc: 'roots from a tree no one remembers planting'},
			{name: 'mask', desc: 'a face worn over a face, the original lost'},
		],
	},
	{
		key: 'style',
		label: 'style',
		options: [
			{name: 'steel engraving', desc: 'Victorian steel engraving, crosshatched shadows, scientific detachment'},
			{name: 'woodcut', desc: 'bold woodcut, stark contrast, the black deeper than absence'},
			{name: 'botanical', desc: 'botanical illustration, obsessive linework, as if cataloguing a specimen'},
			{name: 'alchemical', desc: 'alchemical diagram, geometry as prayer, annotations in dead languages'},
		],
	},
	{
		key: 'mood',
		label: 'mood',
		options: [
			{name: 'violent', desc: 'the stillness before violence, edges too sharp for accident'},
			{name: 'warding', desc: 'something kept out, or kept in, the boundary unclear'},
			{name: 'liminal', desc: 'caught between states, neither one thing nor the other'},
			{name: 'corrupted', desc: 'decay as transformation, rot as slow becoming'},
			{name: 'dormant', desc: 'sleeping but aware, patience measured in centuries'},
			{name: 'resonant', desc: 'vibrating at a frequency just below hearing'},
		],
	},
]
