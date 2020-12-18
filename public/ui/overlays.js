import {html} from '../../web_modules/htm/preact/standalone.module.js'

// A tiny overlay UI component.
export function Overlay(props) {
	return html`
		<div class="Splash Overlay" topleft open>
			<div class="Splash-details">${props.children}</div>
		</div>
	`
}

export function OverlayWithButton(props) {
	return html`
		<details class="Overlay" ...${props}>
			${props.children}
			<figure class="Overlay-bg"></figure>
		</details>
	`
}
