// htm + preact in a single file
// import {html, render, Component} from "https://unpkg.com/htm/preact/standalone.mjs"
import {html, render} from './vendor/htm-preact-standalone.mjs'
import App from './../components/app.js'

const rootEl = document.querySelector('#root')
render(
	html`
		<${App} />
	`,
	rootEl
)
