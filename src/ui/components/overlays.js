import {html} from '../lib.js'

// A tiny overlay UI component.
export function Overlay(props) {
	return html`
		<div class="Overlay" topleft open>
			<div class="Overlay-content">
				<div class="Splash">
					<div class="Splash-details">${props.children}</div>
				</div>
			</div>
			<figure class="Overlay-bg"></figure>
		</div>
	`
}

export function OverlayWithButton(props) {
	return html`
		<div class="Overlay" ...${props}>
			${props.children}
			<figure class="Overlay-bg"></figure>
		</div>
	`
}
