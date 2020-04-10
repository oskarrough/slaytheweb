import {html, Component} from './../web_modules/htm/preact/standalone.module.js'
import {Card} from "./cards.js"

export default class Rewards extends Component {

    render(props) {
        return html`
            <div class="RewardsBox">
                <p>You win. Choose a card to be added to your deck</p>
                <div class="Cards">
                    ${props.cards.map((card) => { 
                        return html`
                            <div class="CardBox" onClick=${() => props.rewardWith(card)}>${Card(card)}</div>
                        `
                    })}
                </div>
            </div>
        `
    }
}