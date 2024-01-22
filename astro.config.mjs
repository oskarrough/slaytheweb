import {defineConfig} from 'astro/config'
import preact from '@astrojs/preact'
import AstroPWA from '@vite-pwa/astro'

// import {execSync} from 'child_process'
// process.env.VITE_GIT_HASH = execSync('git rev-parse HEAD').toString().trimEnd()
// process.env.VITE_GIT_MESSAGE = execSync('git show -s --format=%s').toString().trimEnd()

import sentry from '@sentry/astro'

// https://astro.build/config
export default defineConfig({
	srcDir: './src/ui',
	integrations: [
		preact(),
		AstroPWA({
			registerType: 'autoUpdate',
			devOptions: {
				// enabled: true,
			},
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
		sentry({
			dsn: 'https://8dfaea3ae774cfc8d9a79fdac78b2c5d@o4506580528529408.ingest.sentry.io/4506580555268096',
			sourceMapsUploadOptions: {
				project: 'slaytheweb',
				authToken: process.env.SENTRY_AUTH_TOKEN,
				telemetry: false
			},
		}),
	],
})
