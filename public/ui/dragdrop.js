import {html, Component} from '../../web_modules/htm/preact/standalone.module.js'
import {Draggable} from './../web_modules/gsap/Draggable.js'
import gsap from './animations.js'
import {cards} from '../game/cards.js'
import {cardHasValidTarget} from '../game/utils.js'

// Class to add to the element we are dragging over.
const overClass = 'is-dragOver'

// Makes the card fly back into the hand.
function animateCardToHand(draggable) {
	return gsap.to(draggable.target, {x: draggable.startX, y: draggable.startY})
}

// Nasty but returns the card object from a card DOM element.
function getCardFromElement(el) {
	const cardName = el.querySelector('.Card-name').textContent
	return cards.find((c) => c.name === cardName)
}

function getTargetStringFromElement(el) {
	const targetIndex = Array.from(el.parentNode.children).indexOf(el)
	return el.dataset.type + targetIndex
}

export default function enableDragDrop(container, onAdd) {
	const targets = container.querySelectorAll('.Target')

	container.querySelectorAll('.Hand .Card').forEach((card) => {
		Draggable.create(card, {
			// While dragging, highlight any targets we are dragging over.
			onDrag() {
				if (this.target.attributes.disabled) {
					this.endDrag()
				}
				const cardEl = this.target
				let i = targets.length
				while (--i > -1) {
					// Highlight only if valid target.
					if (this.hitTest(targets[i], '50%')) {
						if (cardHasValidTarget(getCardFromElement(cardEl), getTargetStringFromElement(targets[i]))) {
							targets[i].classList.add(overClass)
						}
					} else {
						targets[i].classList.remove(overClass)
					}
				}
			},
			onRelease() {
				const cardEl = this.target

				// Which element are we dropping on?
				let targetEl
				let i = targets.length
				while (--i > -1) {
					if (this.hitTest(targets[i], '50%')) {
						targetEl = targets[i]
						break
					}
				}

				if (!targetEl) return animateCardToHand(this)

				// If card is allowed here, trigger the callback with target, else animate back.
				const targetString = getTargetStringFromElement(targetEl)
				if (cardHasValidTarget(getCardFromElement(cardEl), targetString)) {
					onAdd(cardEl.dataset.id, targetString, cardEl)
				} else {
					animateCardToHand(this)
				}

				// Remove active class from any other targets.
				targets.forEach((t) => t.classList.remove(overClass))
			},
		})
	})
}
