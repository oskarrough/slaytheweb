// @todo reimplement the logic from decks.js using tinybase persisted localstorage. just for comparisons

// https://tinybase.org/guides/persistence/an-intro-to-persistence/
import {createLocalPersister} from 'tinybase/persisters/persister-browser'
import {createStore} from 'tinybase'

const KEY = 'slaytheweb_custom_decks_tinybase'
const store = createStore()
const persister = createLocalPersister(store, KEY)
// not sure if this is needed
persister.save().then(() => {
	console.log(KEY, 'storage ready')
})

