module.exports = {
	mode: 'jit',
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'media', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				gray: {
					darkest: '#15131a',
					dark: '#2a282e',
					darkless: '#4a474f'
				}
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: [require('@tailwindcss/line-clamp')]
}
