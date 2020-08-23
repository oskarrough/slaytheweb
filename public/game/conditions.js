

function onlyType(state, condition) {
    let boolean = false;
    state.hand.forEach(card => {
        if(card.type !== condition.type) {
            boolean = true;		
        }
    })

    return boolean
}

function shouldNotHaveLessThen(state, condition) {
    let boolean = false;
    const player = state.player;
    if((player.currentHealth / player.maxHealth) * 100 < condition.percentage) {
        boolean = true
    }
    return boolean
}

function shouldNotHaveMoreThen(state, condition) {
    let boolean = false;
    const player = state.player;
    if((player.currentHealth / player.maxHealth) * 100 > condition.percentage) {
        boolean = true
    }
    return boolean
}


export default {
    onlyType,
    shouldNotHaveLessThen,
    shouldNotHaveMoreThen
}