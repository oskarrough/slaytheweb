import {useEffect, useRef, useState} from 'preact/hooks'
import {cards} from '../../content/cards.js'
import {createCard} from '../../game/cards.js'
import {html} from '../lib.js'

/** @typedef {import('../../game/new-game.js').Game} Game */

export default function Console({
	game,
	onJumpToAction,
	onUndo,
	onRedo,
	onRunAction,
	freeMapNav,
	onToggleFreeMapNav,
	onClose,
}) {
	const past = game.past.list || []
	const redoStack = game.redoStack?.list || []

	return html`
    <div class="Box">
      <section>
        <h2><u>C</u>onsole</h2>
        <${CommandInterface}
          game=${game}
          onRunAction=${onRunAction}
          freeMapNav=${freeMapNav}
          onToggleFreeMapNav=${onToggleFreeMapNav}
          onClose=${onClose}
        />
      </section>

      <section>
        <${ActionTimeline} past=${past} onJumpToAction=${onJumpToAction} />
        <menu>
          <button
            class="Button"
            onClick=${onUndo}
            disabled=${past.length === 0}
          >
            ← Undo
          </button>
          <button
            class="Button"
            onClick=${onRedo}
            disabled=${redoStack.length === 0}
          >
            Redo →
          </button>
        </menu>
      </section>
    </div>
  `
}

function ActionTimeline({past, onJumpToAction}) {
	if (!past.length) return html`<p><em>No actions yet...</em></p>`

	return html`
    <ol class="ActionTimeline" scroll>
      ${past.toReversed().map((item, index) => {
				const {action, state} = item
				const meta = state ? `Turn ${state.turn || 0} • Floor ${state.dungeon?.y || 0}` : ''
				return html`
          <li key=${index}>
            <div>
              <strong>${action.type}</strong>${action.card ? `: ${action.card.name}` : ''}
              ${meta && html`<br /><small>${meta}</small>`}
            </div>
            <button class="Button" onClick=${() => onJumpToAction(index)}>
              Jump
            </button>
          </li>
        `
			})}
    </ol>
  `
}

function CommandInterface({game, onRunAction, freeMapNav, onToggleFreeMapNav, onClose}) {
	const [input, setInput] = useState('')
	const [history, setHistory] = useState([])
	const [historyIndex, setHistoryIndex] = useState(-1)
	const [output, setOutput] = useState([])
	const inputRef = useRef(null)
	const outputRef = useRef(null)

	useEffect(() => {
		// Check if parent overlay is open and focus input
		const checkAndFocus = () => {
			const overlay = document.getElementById('Console')
			if (overlay?.hasAttribute('open') && inputRef.current) {
				inputRef.current.focus()
			}
		}

		// Focus on mount
		checkAndFocus()

		// Watch for changes to the open attribute
		const observer = new MutationObserver(checkAndFocus)
		const overlay = document.getElementById('Console')
		if (overlay) {
			observer.observe(overlay, {attributes: true, attributeFilter: ['open']})
		}

		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		if (outputRef.current) {
			// Use requestAnimationFrame to ensure DOM has painted
			requestAnimationFrame(() => {
				if (outputRef.current) {
					outputRef.current.scrollTop = outputRef.current.scrollHeight
				}
			})
		}
	}, [output])

	const markAsCheat = () => {
		game.enqueue({type: 'setDidCheat'})
		game.dequeue()
	}

	const commands = {
		hp: (args) => {
			const amount = Number.parseInt(args[0], 10)
			if (Number.isNaN(amount)) return {error: 'Usage: hp <amount>'}
			const action = amount < 0 ? 'removeHealth' : 'addHealth'
			const absAmount = Math.abs(amount)
			markAsCheat()
			onRunAction(action, {target: 'player', amount: absAmount})
			return {success: `${amount < 0 ? 'Removed' : 'Added'} ${absAmount} HP`}
		},
		energy: (args) => {
			const amount = Number.parseInt(args[0], 10)
			if (Number.isNaN(amount)) return {error: 'Usage: energy <amount>'}
			markAsCheat()
			onRunAction('addEnergyToPlayer', {amount})
			return {success: `Added ${amount} energy`}
		},
		draw: (args) => {
			const amount = Number.parseInt(args[0], 10) || 1
			markAsCheat()
			onRunAction('drawCards', {amount})
			return {success: `Drew ${amount} card${amount === 1 ? '' : 's'}`}
		},
		kill: () => {
			markAsCheat()
			onRunAction('iddqd')
			return {success: 'All enemies set to 1 HP'}
		},
		map: () => {
			markAsCheat()
			onToggleFreeMapNav()
			return {
				success: `Free map nav ${!freeMapNav ? 'enabled' : 'disabled'}`,
			}
		},
		add: (args) => {
			const cardName = args.join(' ')
			if (!cardName) return {error: 'Usage: add <cardName>'}

			// Case-insensitive search
			const card = cards.find((c) => c.name.toLowerCase() === cardName.toLowerCase())
			if (!card) return {error: `Card not found: ${cardName}`}

			markAsCheat()
			const newCard = createCard(card.name)
			onRunAction('addCardToDeck', {card: newCard})
			return {success: `Added ${card.name} to deck`}
		},
		remove: (args) => {
			const cardName = args.join(' ')
			if (!cardName) return {error: 'Usage: remove <cardName>'}

			// Case-insensitive search in deck
			const card = game.state.deck.find((c) => c.name.toLowerCase() === cardName.toLowerCase())
			if (!card) return {error: `Card not found in deck: ${cardName}`}

			markAsCheat()
			onRunAction('removeCard', {card})
			return {success: `Removed ${card.name} from deck`}
		},
		upgrade: (args) => {
			const input = args.join(' ')
			if (!input) return {error: 'Usage: upgrade <cardName> or upgrade all'}

			if (input.toLowerCase() === 'all') {
				const toUpgrade = game.state.deck.filter((c) => !c.upgraded)
				if (toUpgrade.length === 0) return {info: 'All cards already upgraded'}

				markAsCheat()
				toUpgrade.forEach((card) => {
					onRunAction('upgradeCard', {card})
				})
				return {
					success: `Upgraded ${toUpgrade.length} card${toUpgrade.length === 1 ? '' : 's'}`,
				}
			}

			// Case-insensitive search in deck
			const card = game.state.deck.find((c) => c.name.toLowerCase() === input.toLowerCase())
			if (!card) return {error: `Card not found in deck: ${input}`}
			if (card.upgraded) return {error: `${card.name} is already upgraded`}

			markAsCheat()
			onRunAction('upgradeCard', {card})
			return {success: `Upgraded ${card.name}`}
		},
		help: () => ({
			info: `  hp <amount>        - Add/remove health (negative to damage)
  energy <amount>    - Add energy
  draw [amount]      - Draw cards (default: 1)
  kill               - Set all enemies to 1 HP
  map                - Toggle free map navigation
  add <cardName>     - Add card to deck
  remove <cardName>  - Remove card from deck
  upgrade <cardName> - Upgrade specific card
  upgrade all        - Upgrade all cards
  help               - Show this help
  clear              - Clear output`,
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
			: {
					error: `Unknown command: ${name}. Type "help" for available commands.`,
				}

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
		// Always stop propagation to prevent game-screen from handling these events
		if (e.key === 'Escape') {
			e.preventDefault()
			e.stopPropagation()
			onClose?.()
			// Return focus to the app container so shortcuts work immediately
			document.querySelector('.App')?.focus()
			return
		}
		if (e.key === 'Enter') {
			e.preventDefault()
			e.stopPropagation()
			execute(input)
			setInput('')
			return
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault()
			e.stopPropagation()
			navigate('up')
			return
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			e.stopPropagation()
			navigate('down')
			return
		}
	}

	return html`
    <div class="CommandInterface">
      ${
				output.length > 0 &&
				html`
        <output>
          <ol class="scroll" ref=${outputRef}>
            ${output.map(
							({command, result}, i) => html`
                <li key=${i}>
                  <kbd>→ ${command}</kbd>
                  ${Object.entries(result).map(
										([type, msg]) =>
											html`<${type === 'info' ? 'pre' : 'div'} class="Command${type[0].toUpperCase() + type.slice(1)}">${msg}</>`,
									)}
                </li>
              `,
						)}
          </ol>
        </output>
      `
			}
      <input
        ref=${inputRef}
        type="text"
        value=${input}
        onInput=${(e) => setInput(e.target.value)}
        onKeyDown=${handleKey}
        placeholder="Type 'help' for commands..."
      />
      <small>
        ↑↓ for history • Enter to run ${freeMapNav ? ' • ✓ Free map nav' : ''}
      </small>
    </div>
  `
}
