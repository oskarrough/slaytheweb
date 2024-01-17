import * as Sentry from '@sentry/browser'

Sentry.init({
	dsn: 'https://8dfaea3ae774cfc8d9a79fdac78b2c5d@o4506580528529408.ingest.sentry.io/4506580555268096',
	integrations: [
		new Sentry.BrowserTracing({
			// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
			tracePropagationTargets: [/^https:\/\/slaytheweb\.cards/],
		}),
	],
})
