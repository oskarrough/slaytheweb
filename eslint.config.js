import {defineConfig} from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import css from '@eslint/css'

export default defineConfig([
	// Lint CSS
	{
		files: ['src/**/*.css'],
		plugins: { css },
		language: 'css/css'
	},

	// Lint javascripts
	{
		files: ['src/**/*.{js,mjs,cjs}'],
		languageOptions: {globals: globals.browser},
		plugins: {js},
		extends: ['js/recommended'],
		rules: {
			'no-undef': 'warn',
		},
	},

	// Prettier
	{
		files: ['src/**/*.{js,mjs,cjs}'],
		plugins: {
			prettier: prettier
		},
		rules: {
			'prettier/prettier': 'error'
		}
	},

	// Disable rules that conflict with Prettier globally
	eslintConfigPrettier
])
