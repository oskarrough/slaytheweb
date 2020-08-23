

function onlyType(cards, condition) {
    let boolean = false;
    cards.forEach(card => {
        if(card.type !== condition.type) {
            boolean = true;		
        }
    })

    return boolean
}

export default {
    onlyType
}