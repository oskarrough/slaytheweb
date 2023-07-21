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
			manifest: {
				name: 'Slay the Web',
				start_url: '/index.html',
				display: 'fullscreen',
				orientation: 'landscape',
				background_color: '#116f54',
				theme_color: '#116f54',
				icons: [
					{
						src: '/images/favicons/favicon-192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/images/favicons/favicon-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
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
