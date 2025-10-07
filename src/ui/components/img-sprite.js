import {getSpriteStyle} from '../../utils/sprites.js'

/**
 * Custom element for displaying sprite images from spritesheets
 *
 * @attr {string} sprite - Sprite ID (e.g., "7.c", "1.a")
 * @attr {string} [sheet="monsters"] - Spritesheet name (monsters, heroes, etc.)
 * @attr {number} [scale="2"] - Display scale multiplier (1=32px, 2=64px)
 * @attr {string} [class] - Additional CSS classes to apply
 *
 * @example
 * <img-sprite sprite="7.c"></img-sprite>
 * <img-sprite sprite="1.a" sheet="monsters" scale="3"></img-sprite>
 * <img-sprite sprite="2.b" class="Target-sprite"></img-sprite>
 */
class ImgSprite extends HTMLElement {
	connectedCallback() {
		const spriteId = this.getAttribute('sprite')
		if (!spriteId) return

		const sheet = this.getAttribute('sheet') || 'monsters'
		const scale = parseInt(this.getAttribute('scale') || '2', 10)
		const additionalClasses = this.getAttribute('class') || ''

		try {
			const style = getSpriteStyle(spriteId, sheet, scale)
			const styleString = Object.entries(style)
				.map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
				.join('; ')

			const classes = ['sprite', additionalClasses].filter(Boolean).join(' ')
			this.className = classes
			this.setAttribute('style', styleString)
		} catch (err) {
			console.warn(`Failed to render sprite "${spriteId}":`, err)
			this.className = 'sprite sprite--error'
			this.setAttribute('title', `Invalid sprite: ${spriteId}`)
		}
	}
}

customElements.define('img-sprite', ImgSprite)
