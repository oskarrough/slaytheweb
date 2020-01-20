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

	render(props) {
		let time = new Date(this.state.time).toLocaleTimeString()
		return html`
			<div>
				<span>Game state history ${time}</span>
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
