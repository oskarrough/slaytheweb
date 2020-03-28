importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

const {registerRoute} = workbox.routing
const {precacheAndRoute} = workbox.precaching
const {CacheFirst, StaleWhileRevalidate} = workbox.strategies
const {CacheableResponse} = workbox.cacheableResponse

console.log('hello from service worker')
if (workbox) {
	console.log(`Yay! Workbox is loaded 🎉`)
} else {
	console.log(`Boo! Workbox didn't load 😬`)
}

// Make sure index.html is cached.
precacheAndRoute([{url: '/index.html', revision: '1'}])

// Catch all js and css files and cache them.
registerRoute(
	/\.(?:js|css)$/,
	new StaleWhileRevalidate({
		cacheName: 'static-resources'
	})
)

// Also cache images.
registerRoute(
	/\.(?:png|gif|jpg|jpeg|webp|svg)$/,
	new CacheFirst({
		cacheName: 'images',
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
			})
		]
	})
)
