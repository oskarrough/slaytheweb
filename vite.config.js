import {resolve} from 'path'
import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [
		VitePWA({
			base: '/',
			injectRegister: 'auto',
			registerType: 'prompt',
			// devOptions: {enabled: true, },
			workbox: {
				maximumFileSizeToCacheInBytes: 10e6,
				globPatterns: ['**/*.{html,css,js,json,svg,png,ico}'],
			},
			manifest: {
				name: 'Slay the Web',
				short_name: 'Slay the Web',
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
		target: 'esnext',
		rollupOptions: {
			input: {
				index: resolve('index.html'),
				collection: resolve('collection.html'),
				stats: resolve('stats.html'),
				text: resolve('text.html'),
				manual: resolve('manual.html'),
			},
		},
	},
})
