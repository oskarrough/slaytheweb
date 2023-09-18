import Draggable from 'gsap/Draggable.js'
import gsap from './animations.js'
// import sfx from './sounds.js'
import {cardHasValidTarget} from '../game/utils-state.js'

// Class to add to the element we are dragging over.
const overClass = 'is-dragOver'

// Makes the card fly back into the hand.
function animateCardToHand(draggable) {
	return gsap.to(draggable.target, {x: draggable.startX, y: draggable.startY})
}

/**
 * @param {HTMLElement} el
 * @returns {string}
 */
function getTargetStringFromElement(el) {
	const targetIndex = Array.from(el.parentNode.children).indexOf(el)
	return el.dataset.type + targetIndex
}

export default function enableDragDrop(container, afterRelease) {
	const targets = container.querySelectorAll('.Target')
	const cards = container.querySelectorAll('.Hand .Card')

	cards.forEach((card) => {
		Draggable.create(card, {
			onDragStart() {
				// sfx.selectCard()
			},
			// While dragging, highlight any targets we are dragging over.
			onDrag() {
				if (this.target.attributes.disabled) {
					this.endDrag()
				}
				let i = targets.length
				while (--i > -1) {
					// Highlight only if valid target.
					if (this.hitTest(targets[i], '40%')) {
						if (
							cardHasValidTarget(
								this.target.getAttribute('data-card-target'),
								getTargetStringFromElement(targets[i]),
							)
						) {
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
					if (this.hitTest(targets[i], '40%')) {
						targetEl = targets[i]
						break
					}
				}

				if (!targetEl) return animateCardToHand(this)

				// If card is allowed here, trigger the callback with target, else animate back.
				const targetString = getTargetStringFromElement(targetEl)
				if (cardHasValidTarget(cardEl.getAttribute('data-card-target'), targetString)) {
					afterRelease(cardEl.dataset.id, targetString, cardEl)
				} else {
					animateCardToHand(this)
					// sfx.cardToHand()
				}

				// Remove active class from any other targets.
				targets.forEach((t) => t.classList.remove(overClass))
			},
		})
	})
}
