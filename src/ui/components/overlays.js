import {html} from '../lib.js'

// A tiny overlay UI component.
export function Overlay(props) {
	const {open = true, topleft = true, middle = false} = props
	return html`
		<div class="Overlay" open=${open} topleft=${topleft} middle=${middle}>
			<div class="Overlay-content">${props.children}</div>
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
