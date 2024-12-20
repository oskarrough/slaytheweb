import {defineConfig} from 'astro/config'
import preact from '@astrojs/preact'

// https://astro.build/config
export default defineConfig({
	srcDir: './src/ui',
	vite: {
		build: {
			sourcemap: true,
		},
	},
	integrations: [
		preact(),

		// sentry({
		// 	dsn: 'https://8dfaea3ae774cfc8d9a79fdac78b2c5d@o4506580528529408.ingest.sentry.io/4506580555268096',
		// 	sourceMapsUploadOptions: {
		// 		project: 'slaytheweb',
		// 		authToken: process.env.SENTRY_AUTH_TOKEN,
		// 		telemetry: false,
		// 	},
		// }),
	],
})
