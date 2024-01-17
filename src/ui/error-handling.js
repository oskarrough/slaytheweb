import * as Sentry from '@sentry/browser'

Sentry.init({
	dsn: 'https://8dfaea3ae774cfc8d9a79fdac78b2c5d@o4506580528529408.ingest.sentry.io/4506580555268096',
	integrations: [
		new Sentry.BrowserTracing({
			// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
			tracePropagationTargets: ['localhost', /^https:\/\/slaytheweb\.cards/],
		}),
		// new Sentry.Replay({
		// 	maskAllText: false,
		// 	blockAllMedia: false,
		// }),
	],
	// Performance Monitoring
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	// Session Replay
	// replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	// replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})
