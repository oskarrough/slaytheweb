import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Queue extends Component {
	constructor(props) {
		super(props)
		this.state = {time: Date.now()}
	}

	componentDidMount() {
		// Update time every second. Also serves the issue of
		// properly keeping the props.history up to date.
		this.timer = setInterval(() => {
			this.setState({time: Date.now()})
		}, 1000)
	}

	componentWillUnmount() {
		clearInterval(this.timer)
	}

	render(props, state) {
		const time = new Date(state.time).toLocaleTimeString()
		return html`
			<div>
				<p>Game state history ${time}</p>
				<ol>
					${props.history.map(
						(item, index) =>
							html`
								<li key=${index}>${item.type}</li>
							`
					)}
				</ol>
			</div>
		`
	}
}
