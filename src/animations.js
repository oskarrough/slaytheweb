// import { tween } from 'https://cdn.jsdelivr.net/npm/popmotion@8.6.2/dist/popmotion.es.js'
// import {tween} from 'https://unpkg.com/popmotion@8.6.2/dist/popmotion.es.js?module'
// import {popmotion} from 'https://unpkg.com/popmotion@8.6.2/dist/popmotion.global.min.js'

const {tween, styler, value, pointer, listen, spring} = window.popmotion

export function cardHover(element) {
	const container = styler(element)
	const start = () => {
		tween({
			from: {scale: 1},
			to: {scale: 1.3},
			duration: 60
		}).start(container.set)
	}
	const stop = () => {
		tween({
			from: {scale: 1.3},
			to: {scale: 1},
			duration: 500
		}).start(container.set)
	}
	listen(element, 'mouseenter').start(start)
	listen(element, 'mouseleave').start(stop)
}

export function counterAnimation() {
	const counter = document.querySelector('.Energy i')
	const updateCounter = v => (counter.innerHTML = v)
	tween({to: 300, duration: 5000}).start(updateCounter)
}

export function dragndrop(ball) {
	const ballStyler = styler(ball)
	const ballXY = value({x: 0, y: 0}, ballStyler.set)
	let pointerTracker

	const startTracking = () => {
		pointerTracker = pointer(ballXY.get()).start(ballXY)
	}

	const stopTracking = () => {
		if (!pointerTracker) return
		pointerTracker.stop()
		spring({
			from: ballXY.get(),
			velocity: ballXY.getVelocity(),
			stiffness: 200,
			damping: 50
		}).start(ballXY)
	}

	listen(ball, 'mousedown touchstart').start(startTracking)
	listen(document, 'mouseup touchend').start(stopTracking)
}
