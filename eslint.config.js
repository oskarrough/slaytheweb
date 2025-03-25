import {defineConfig} from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
	{
		files: ['src/**/*.{js,mjs,cjs}'],
		languageOptions: {globals: globals.browser},
		plugins: {js},
		extends: ['js/recommended'],
		rules: {
			'no-undef': 'warn',
		},
	},
	{
		// Apply Prettier only to files in src directory
		files: ['src/**/*.{js,mjs,cjs}'],
		plugins: {
			prettier: prettier
		},
		rules: {
			'prettier/prettier': 'error'
		}
	},
	// This disables rules that conflict with Prettier globally
	eslintConfigPrettier
])
