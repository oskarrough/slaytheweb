import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

// The timer here also makes sure the component renders the newest history.

export default class Queue extends Component {
	constructor(props) {
		super(props)
		this.state = {time: Date.now()}
	}
	componentDidMount() {
		this.timer = setInterval(() => {
			this.setState({time: Date.now()})
		}, 500)
	}
	componentWillUnmount() {
		clearInterval(this.timer)
	}

	render(props, state) {
		const time = new Date(state.time).toLocaleTimeString()
		return html`
			<details>
				<summary>Kortgame v0 ${time}</summary>
				<ol>
					${props.history.map(
						(item, index) =>
							html`
								<li key=${index}>${item.type}</li>
							`
					)}
				</ol>
			</details>
		`
	}
}
