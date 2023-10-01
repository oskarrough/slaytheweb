// eslint-disable-next-line no-undef
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	plugins: ['jsdoc'],
	extends: [
		'eslint:recommended',
		'plugin:prettier/recommended',
		'plugin:jsdoc/recommended',
		// 'plugin:jsdoc/recommended-typescript-flavor',
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		complexity: ['warn', 14],
		'jsdoc/require-property-description': 'off',
		'jsdoc/require-param-description': 'off',
		// 'jsdoc/require-returns-description': 'off',
		'jsdoc/require-param': 'off',
		'jsdoc/require-returns': 'off',
	},
	settings: {
		jsdoc: {
			tagNamePreference: {
				property: 'prop',
			},
		},
	},
}
