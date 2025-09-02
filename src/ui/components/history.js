import {html, Component} from '../lib.js'

export default class HistoryQueue extends Component {
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
			<div class="Box">
				<h2>Your past... ${time}</h2>
				<${List} items=${props.past} onUndo=${props.onUndo} />
			</div>
		`
	}
}

function List({items, onUndo}) {
	if (!items.length) return html` <p>...is uncertain.</p> `
	return html`
		<ol class="HistoryList">
			${items.map(Item)}
		</ol>
		<p>
			<button onClick=${() => onUndo()}><u>U</u>ndo</button>
		</p>
	`
}

function Item(item) {
	return html` <li key=${item}><em>${item.action.type}</em> ${item.action.card?.name}</li> `
}
