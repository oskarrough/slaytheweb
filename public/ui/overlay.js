import {html} from '../../web_modules/htm/preact/standalone.module.js'

// A tiny overlay UI component.
export default function Overlay(props) {
	return html`
		<div class="Splash Overlay" topleft open>
			<div class="Splash-details">${props.children}</div>
		</div>
	`
}
