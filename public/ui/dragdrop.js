import {html, Component} from '../../web_modules/htm/preact/standalone.module.js'
import {Draggable} from './../web_modules/gsap/Draggable.js'
import gsap from './animations.js'

// Class to add to the element we are dragging over.
const overClass = 'is-dragOver'

export default function enableDragDrop(container, onAdd) {
	const targets = container.querySelectorAll('.Target')

	container.querySelectorAll('.Hand .Card').forEach(card => {
		Draggable.create(card, {
			// While dragging, highlight any targets we are dragging over.
			onDrag() {
				let i = targets.length
				while (--i > -1) {
					if (this.hitTest(targets[i], '50%')) {
						targets[i].classList.add(overClass)
					} else {
						targets[i].classList.remove(overClass)
					}
				}
			},
			onRelease() {
				// Which target are we dropping the card on?
				let targetElement = undefined
				let i = targets.length
				while (--i > -1) {
					if (this.hitTest(targets[i], '50%')) {
						targetElement = targets[i]
						break
					}
				}
				if (targetElement) {
					const cardElement = this.target
					const index = Array.from(targetElement.parentNode.children).indexOf(targetElement)
					const target = targetElement.dataset.type + index
					onAdd(cardElement.dataset.id, target, cardElement)
				} else {
					gsap.to(this.target, {x: this.startX, y: this.startY})
				}
				// Remove active class from any other targets.
				targets.forEach(t => t.classList.remove(overClass))
			}
		})
	})
}
