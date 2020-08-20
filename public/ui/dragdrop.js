import {html, Component} from '../../web_modules/htm/preact/standalone.module.js'
import {Draggable} from './../web_modules/gsap/Draggable.js'
import gsap from './animations.js'
import {cards} from '../game/cards.js'
import {canPlayCard} from '../game/utils.js'

// Class to add to the element we are dragging over.
const overClass = 'is-dragOver'

// Makes the card fly back into the hand.
function cancelDrag(draggable) {
	return gsap.to(draggable.target, {x: draggable.startX, y: draggable.startY})
}

export default function enableDragDrop(container, onAdd) {
	const targets = container.querySelectorAll('.Target')

	container.querySelectorAll('.Hand .Card').forEach(card => {
		Draggable.create(card, {
			// While dragging, highlight any targets we are dragging over.
			onDrag() {
				if (this.target.attributes.disabled) {
					this.endDrag()
				}
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

				if (!targetElement) return cancelDrag(this)

				const cardElement = this.target
				const targetIndex  = Array.from(targetElement.parentNode.children).indexOf(targetElement)
				const target = targetElement.dataset.type + targetIndex

				// Check if the card allows us to drop it here.
				const cardName = cardElement.querySelector('.Card-name').textContent
				const card = cards.find(c => c.name === cardName)
				if (!canPlayCard(card, target)) return cancelDrag(this)

				onAdd(cardElement.dataset.id, target, cardElement)

				// Remove active class from any other targets.
				targets.forEach(t => t.classList.remove(overClass))
			}
		})
	})
}
