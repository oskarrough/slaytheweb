import gsap from './../web_modules/gsap.js'

//
export default gsap

// So we can use it in the browser.
window.gsap = gsap

// or get other plugins:
// import Draggable from 'gsap/Draggable'
// import ScrollTrigger from 'gsap/ScrollTrigger'

// or all tools are exported from the "all" file (excluding bonus plugins):
// import {gsap, ScrollTrigger, Draggable, MotionPathPlugin} from 'gsap/all'

// don't forget to register plugins
// gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin)

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


gsap.registerEffect({
	name: 'discardCard',
	effect: (targets, config) => {
		// debugger
		// gsap.killTweensOf(targets)
		// const x = window.innerWidth
		return gsap.fromTo(targets, {
			autoAlpha: 1},{
			duration: 0.8,
			x: window.innerWidth,
			y: window.innerHeight,
			rotation: 90,
			scale: 0.5,
			ease: 'power2.inOut',
			onComplete: config.onComplete
		})
	}
})

