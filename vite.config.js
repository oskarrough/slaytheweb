import {resolve} from 'path'
import {defineConfig} from 'vite'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				stats: resolve(__dirname, 'stats.html'),
				collection: resolve(__dirname, 'collection.html'),
			},
		},
	},
})
