import {html} from '../lib.js'

export default function VersionInfo() {
	const hash = import.meta.env.VITE_GIT_HASH
	const msg = import.meta.env.VITE_GIT_MESSAGE

	const commitUrl = `https://github.com/oskarrough/slaytheweb/commit/${hash}`
	return html`
		<p center inverse>
			<small>Latest update: <em><a href=${commitUrl} rel="referrer" target="_blank">${msg}</a></em></p>
		</p>
	`
}

