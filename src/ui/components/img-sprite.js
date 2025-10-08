import {getSpriteStyle} from '../../utils/sprites.js'

/**
 * Custom element for displaying sprite images from spritesheets
 *
 * @attr {string} sprite - Row/col coordinates (e.g., "0,2" or "[0,2]") or legacy sprite ID ("7.c")
 * @attr {string} row - Row index (alternative to sprite attribute)
 * @attr {string} col - Column index (alternative to sprite attribute)
 * @attr {string} [sheet="monsters"] - Spritesheet name (monsters, animals, rogues, items, tiles)
 * @attr {number} [scale="2"] - Display scale multiplier (1=32px, 2=64px)
 * @attr {string} [class] - Additional CSS classes to apply
 *
 * @example
 * <img-sprite row="0" col="2" sheet="monsters"></img-sprite>
 * <img-sprite sprite="0,2" sheet="animals" scale="3"></img-sprite>
 * <img-sprite sprite="[6,2]"></img-sprite>
 */
class ImgSprite extends HTMLElement {
	connectedCallback() {
		const sheet = this.getAttribute('sheet') || 'monsters'
		const scale = parseInt(this.getAttribute('scale') || '2', 10)
		const additionalClasses = this.getAttribute('class') || ''

		let row, col

		// Try getting row/col from individual attributes first
		if (this.hasAttribute('row') && this.hasAttribute('col')) {
			row = parseInt(this.getAttribute('row'), 10)
			col = parseInt(this.getAttribute('col'), 10)
		} else {
			// Parse sprite attribute
			const sprite = this.getAttribute('sprite')
			if (!sprite) return

			// Handle array notation: "[0,2]" or "0,2"
			const cleaned = sprite.replace(/[[\]]/g, '')
			const parts = cleaned.split(',').map((s) => s.trim())

			if (parts.length === 2) {
				row = parseInt(parts[0], 10)
				col = parseInt(parts[1], 10)
			} else {
				console.warn(`Invalid sprite format: ${sprite}. Expected "row,col" or "[row,col]"`)
				this.className = 'sprite sprite--error'
				this.setAttribute('title', `Invalid sprite: ${sprite}`)
				return
			}
		}

		try {
			const style = getSpriteStyle(row, col, sheet, scale)
			const styleString = Object.entries(style)
				.map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
				.join('; ')

			const classes = ['sprite', additionalClasses].filter(Boolean).join(' ')
			this.className = classes
			this.setAttribute('style', styleString)
		} catch (err) {
			console.warn(`Failed to render sprite [${row},${col}]:`, err)
			this.className = 'sprite sprite--error'
			this.setAttribute('title', `Invalid sprite: [${row},${col}]`)
		}
	}
}

customElements.define('img-sprite', ImgSprite)
