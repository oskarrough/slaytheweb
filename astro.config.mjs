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
	devToolbar: {
		enabled: false
	},
	integrations: [
		preact(),
	],
})
