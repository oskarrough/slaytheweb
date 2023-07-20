import {html, Component} from './lib.js'

export default class Queue extends Component {
	constructor(props) {
		super(props)
		this.state = {time: Date.now()}
	}
	componentDidMount() {
		// The timer here also makes sure the component renders the newest history.
		this.timer = setInterval(() => {
			this.setState({time: Date.now()})
		}, 500)
	}
	componentWillUnmount() {
		clearInterval(this.timer)
	}
	render(props, state) {
		const time = new Date(state.time).toLocaleTimeString()
		// <h2>Future ${time}</h2>
		// <${List} items=${props.future} />
		return html`
			<div class="History">
				<h3>Your past ${time}</h3>
				<${List} items=${props.past} />
			</div>
		`
	}
}

function List({items}) {
	if (!items.length) return html` <p>...is uncertain.</p> `
	return html`
		<ol>
			${items.map(Item)}
		</ol>
	`
}

function Item(item) {
	return html`
		<li key=${item}>${item.action.type} ${item.action.card && item.action.card.name}</li>
	`
}
