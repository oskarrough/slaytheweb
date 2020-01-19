import {Component, html} from '../vendor/htm-preact-standalone.mjs'

export default class Queue extends Component {
	// state = {time: Date.now()}

	constructor(props) {
		super(props)
		console.log({props})
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

	render(props) {
		let time = new Date(this.state.time).toLocaleTimeString()
		return html`
			<div>
				<span>${time}</span>
				<ol class="Queue">
					${props.queue.map(
						item => html`
							<li key=${item.id}>${item.callback.name}(${item.args.name})</li>
						`
					)}
				</ol>
			</div>
		`
	}
}
