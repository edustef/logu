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
					light: '#625f69'
				}
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
}
