/* global importScripts, workbox */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js')

const {registerRoute} = workbox.routing
const {precacheAndRoute} = workbox.precaching
const {CacheFirst, NetworkFirst, StaleWhileRevalidate} = workbox.strategies

console.log('hello from service worker')
if (workbox) {
	console.log(`Yay! Workbox is loaded 🎉`)
} else {
	console.log(`Boo! Workbox didn't load 😬`)
}

// Make sure index.html is cached.
precacheAndRoute([{url: '/index.html', revision: '2'}])

// Cache script resources, i.e. JS files.
registerRoute(({request}) => request.destination === 'script', new NetworkFirst())

// Cache style resources, i.e. CSS files.
registerRoute(
	({request}) => request.destination === 'style',
	// Use cache but update in the background.
	new StaleWhileRevalidate()
)

// Also cache images.
registerRoute(
	/\.(?:png|gif|jpg|jpeg|webp|svg)$/,
	new CacheFirst({
		cacheName: 'images',
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			}),
		],
	})
)
