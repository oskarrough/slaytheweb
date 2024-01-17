import {resolve} from 'path'
import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'
import {execSync} from 'child_process'
import {sentryVitePlugin} from '@sentry/vite-plugin'

export default defineConfig(() => {
	process.env.VITE_GIT_HASH = execSync('git rev-parse HEAD').toString().trimEnd()
	process.env.VITE_GIT_MESSAGE = execSync('git show -s --format=%s').toString().trimEnd()

	return {
		build: {
			target: 'esnext',
			sourcemap: true,
			rollupOptions: {
				input: {
					index: resolve('index.html'),
					collection: resolve('collection.html'),
					stats: resolve('stats.html'),
					text: resolve('text.html'),
					manual: resolve('manual.html'),
					mapDemo: resolve('map-demo.html'),
				},
			},
		},
		plugins: [
			VitePWA({
				// base: '/',
				// How to register the sw
				// injectRegister: 'script', // or 'inline'
				// Whether to update automatically, or prompt for an update
				// registerType: 'prompt',
				workbox: {
					globPatterns: ['**/*.{html,css,js,json,svg,png,ico,webp,woff,woff2,wasm}'],
				},
				// Enable in dev server
				// devOptions: {
				// 	enabled: true
				// },
				// The actual webmanifest
				manifest: {
					name: 'Slay the Web',
					short_name: 'Slay the Web',
					description:
						'a singleplayer, deck builder, roguelike card crawl game for the web based on Slay the Spire',
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
			// Put the Sentry vite plugin after all other plugins
			sentryVitePlugin({
				authToken: process.env.SENTRY_AUTH_TOKEN,
				org: 'oskarrough',
				project: 'slaytheweb',
				telemetry: false,
			}),
		],
	}
})
