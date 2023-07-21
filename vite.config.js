import {resolve} from 'path'
import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [
		VitePWA({
			registerType: 'autoUpdate',
			devOptions: {
				// enabled: true,
			},
		}),
	],
	build: {
		rollupOptions: {
			input: {
				index: resolve('index.html'),
				text: resolve('text.html'),
				stats: resolve('stats.html'),
				collection: resolve('collection.html'),
			},
		},
	},
})
