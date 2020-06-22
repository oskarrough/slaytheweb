import gsap from './../web_modules/gsap.js'

window.gsap = gsap

gsap.registerEffect({
	name: 'dealCards',
	effect: (targets, config) => {
		const x = window.innerWidth
		gsap.killTweensOf(targets)
		gsap.set(targets, {
			rotation: -25,
			x: -x,
			y: 100,
			scale: 0.5
		})
		console.log('dealCards')
		return gsap.to(targets, {
			duration: config.duration,
			delay: config.delay,
			scale: 1,
			x: 0,
			y: 0,
			// y: function (index) {
			// 	const offset = parseInt(index, 10) - 2
			// 	return offset * 20
			// },
			rotation: function (index) {
				const offset = parseInt(index, 10) - 2
				return offset * 2
			},
			stagger: -0.1,
			// rotation: gsap.utils.random(-2, 2),
			ease: 'back.out(0.3)'
		})
	},
	defaults: {
		delay: 0.4,
		duration: 0.8
	}
})

gsap.registerEffect({
	name: 'discardHand',
	effect: (targets, config) => {
		gsap.killTweensOf(targets)
		const x = window.innerWidth
		return gsap.to(targets, {
			duration: 0.8,
			x,
			rotation: 25,
			stagger: -0.1,
			scale: 0.5,
			ease: 'power2.inOut',
			onComplete: config.onComplete
		})
	}
})

export default gsap
