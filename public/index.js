import {html, render} from './web_modules/htm/preact/standalone.module.js'
import App from '../components/app.js'

const rootEl = document.querySelector('#root')
render(
	html`
		<${App} />
	`,
	rootEl
)
