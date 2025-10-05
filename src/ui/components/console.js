import {useEffect, useRef, useState} from 'preact/hooks'
import {html} from '../lib.js'

/** @typedef {import('../../game/new-game.js').Game} Game */

export default function Console({game, onJumpToAction, onUndo, onRedo, onRunAction, freeMapNav, onToggleFreeMapNav}) {
	const past = game.past.list || []
	const redoStack = game.redoStack?.list || []

	return html`
		<div class="Box">
			<h2><u>C</u>onsole</h2>

			<section>
				<h3>Commands</h3>
				<${CommandInterface} game=${game} onRunAction=${onRunAction} freeMapNav=${freeMapNav} onToggleFreeMapNav=${onToggleFreeMapNav} />
			</section>

			<section>
				<h3>Timeline (${past.length} actions)</h3>
				<${ActionTimeline} past=${past} onJumpToAction=${onJumpToAction} />
				<p>
					<button onClick=${onUndo} disabled=${past.length === 0}>◄ Undo (u)</button>
					<button onClick=${onRedo} disabled=${redoStack.length === 0}>Redo (r) ►</button>
				</p>
			</section>
		</div>
	`
}

function ActionTimeline({past, onJumpToAction}) {
	if (!past.length) return html`<p><em>No actions yet...</em></p>`

	return html`
		<ol class="ActionTimeline">
			${past.map((item, index) => {
				const {action, state} = item
				const meta = state ? `Turn ${state.turn || 0} • Floor ${state.dungeon?.y || 0}` : ''
				return html`
					<li key=${index}>
						<div>
							<strong>${action.type}</strong>${action.card ? `: ${action.card.name}` : ''}
							${meta && html`<br/><small>${meta}</small>`}
						</div>
						<button onClick=${() => onJumpToAction(index)}>Jump</button>
					</li>
				`
			})}
		</ol>
	`
}

function CommandInterface({game, onRunAction, freeMapNav, onToggleFreeMapNav}) {
	const [input, setInput] = useState('')
	const [history, setHistory] = useState([])
	const [historyIndex, setHistoryIndex] = useState(-1)
	const [output, setOutput] = useState([])
	const inputRef = useRef(null)

	useEffect(() => inputRef.current?.focus(), [])

	const commands = {
		hp: (args) => {
			const amount = Number.parseInt(args[0], 10)
			if (Number.isNaN(amount)) return {error: 'Usage: hp <amount>'}
			const action = amount < 0 ? 'removeHealth' : 'addHealth'
			const absAmount = Math.abs(amount)
			game.state.didCheat = true
			onRunAction(action, {target: 'player', amount: absAmount})
			return {success: `${amount < 0 ? 'Removed' : 'Added'} ${absAmount} HP`}
		},
		energy: (args) => {
			const amount = Number.parseInt(args[0], 10)
			if (Number.isNaN(amount)) return {error: 'Usage: energy <amount>'}
			game.state.didCheat = true
			onRunAction('addEnergyToPlayer', {amount})
			return {success: `Added ${amount} energy`}
		},
		draw: (args) => {
			const amount = Number.parseInt(args[0], 10) || 1
			game.state.didCheat = true
			onRunAction('drawCards', {amount})
			return {success: `Drew ${amount} card${amount === 1 ? '' : 's'}`}
		},
		kill: () => {
			game.state.didCheat = true
			onRunAction('iddqd')
			return {success: 'All enemies set to 1 HP'}
		},
		map: () => {
			game.state.didCheat = true
			onToggleFreeMapNav()
			return {success: `Free map nav ${!freeMapNav ? 'enabled' : 'disabled'}`}
		},
		help: () => ({
			info: `Available commands:
  hp <amount>      - Add/remove health (negative to damage)
  energy <amount>  - Add energy
  draw [amount]    - Draw cards (default: 1)
  kill             - Set all enemies to 1 HP
  map              - Toggle free map navigation
  help             - Show this help
  clear            - Clear output`,
		}),
		clear: () => setOutput([]),
	}

	const execute = (cmd) => {
		const trimmed = cmd.trim()
		if (!trimmed) return

		setHistory((prev) => [...prev, trimmed])
		setHistoryIndex(-1)

		const [name, ...args] = trimmed.split(/\s+/)
		const result = commands[name]
			? commands[name](args)
			: {error: `Unknown command: ${name}. Type "help" for available commands.`}

		if (result) setOutput((prev) => [...prev, {command: trimmed, result}])
	}

	const navigate = (direction) => {
		if (!history.length) return
		const newIndex =
			direction === 'up' ? (historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)) : historyIndex + 1
		if (direction === 'down' && newIndex >= history.length) {
			setHistoryIndex(-1)
			setInput('')
		} else {
			setHistoryIndex(newIndex)
			setInput(history[newIndex])
		}
	}

	const handleKey = (e) => {
		if (e.key === 'Enter') {
			execute(input)
			setInput('')
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault()
			navigate('up')
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			navigate('down')
		}
	}

	return html`
		<div class="CommandInterface">
			${
				output.length > 0 &&
				html`
				<div class="CommandOutput">
					${output.map(
						({command, result}, i) => html`
						<div key=${i} class="CommandEntry">
							<div class="CommandInput">→ ${command}</div>
							${Object.entries(result).map(
								([type, msg]) =>
									html`<${type === 'info' ? 'pre' : 'div'} class="Command${type[0].toUpperCase() + type.slice(1)}">${msg}</>`,
							)}
						</div>
					`,
					)}
				</div>
			`
			}
			<div class="CommandInputBox">
				<span>→</span>
				<input
					ref=${inputRef}
					type="text"
					value=${input}
					onInput=${(e) => setInput(e.target.value)}
					onKeyDown=${handleKey}
					placeholder="Type 'help' for commands..."
				/>
			</div>
			<small style="opacity: 0.6; margin-top: 0.5rem; display: block;">
				↑↓ for history • Enter to run • ${freeMapNav ? '✓ Free map nav' : ''}
			</small>
		</div>
	`
}
