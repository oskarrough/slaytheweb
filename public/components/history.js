import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Queue extends Component {
	constructor(props) {
		super(props)
		this.state = {time: Date.now()}
	}

	// Called whenever our component is created
	componentDidMount() {
		// update time every second
		this.timer = setInterval(() => {
			this.setState({time: Date.now()})
		}, 1000)
	}

	// Called just before our component will be destroyed
	componentWillUnmount() {
		// stop when not renderable
		clearInterval(this.timer)
	}

	render(props, state) {
		let time = new Date(state.time).toLocaleTimeString()
		// console.log({props})
		return html`
			<div>
				<p>Game state history ${time}</p>
				<ol class="Queue">
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
