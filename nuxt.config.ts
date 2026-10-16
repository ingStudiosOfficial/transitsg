// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	modules: [
		'@nuxt/eslint',
		'@nuxt/icon',
		'@nuxtjs/seo',
		'nuxt-maplibre',
		'@vueuse/nuxt',
		'@vite-pwa/nuxt',
	],

	routeRules: {},

	site: {
		name: 'transitsg',
	},

	app: {
		head: {
			link: [
				{
					rel: 'icon',
					type: 'image/png',
					href: '/icon.png',
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: '/favicon.ico',
				},
			],
		},
	},

	css: ['~/assets/css/main.css'],

	future: {
		compatibilityVersion: 4,
	},

	vue: {
		compilerOptions: {
			isCustomElement: (tag) => tag.startsWith('m3e-'),
		},
	},

	nitro: {
		storage: {
			data: {
				driver: 'fs',
				base: './data',
			},
		},
	},

	pwa: {
		registerType: 'autoUpdate',
		strategies: 'generateSW',
		client: {
			installPrompt: true,
		},
		manifest: {
			short_name: 'transitsg',
			name: 'transitsg',
			description:
				'Singapore bus arrivals, bus routes, train service alerts all in one web app using the LTA DataMall API.',
			icons: [
				{
					src: 'logo.png',
					sizes: '1000x1000',
					type: 'image/png',
					purpose: 'any',
				},
				{
					src: 'logo_maskable.png',
					sizes: '1000x1000',
					type: 'image/png',
					purpose: 'maskable',
				},
				{
					src: 'logo_maskable.png',
					sizes: '1000x1000',
					type: 'image/png',
					purpose: 'monochrome',
				},
			],
			start_url: '/',
			display: 'standalone',
			theme_color: '#F4FBF9',
			background_color: '#F4FBF9',
			categories: ['travel', 'navigation', 'transportation', 'utilities'],
		},
		includeAssets: ['public/*'],
		workbox: {
			globPatterns: ['**/*.{html,css,js,png,svg,ico,json}'],
			globDirectory: 'dist',
			cacheId: '5',
			cleanupOutdatedCaches: true,
			clientsClaim: true,
			skipWaiting: true,
			navigateFallback: '/',
		},
		devOptions: {
			enabled: true,
			type: 'module',
		},
	},
});
