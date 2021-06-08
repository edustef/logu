import { setLocale } from 'yup'
import { startsWithNumber } from '../utils/regex'

export default function yupConfig() {
	setLocale({
		mixed: {
			default: 'validation:invalidField',
			required: (val) => {
				return { key: 'validation:required', values: { label: val.label } }
			}
		},
		string: {
			matches: ({ label, regex }) => {
				let key: string
				if (regex === startsWithNumber) {
					key = 'validation:notNumberFirst'
				}

				return {
					key,
					values: {
						label,
						regex
					}
				}
			},
			email: () => ({ key: 'validation:email' }),
			min: ({ min, label }) => ({ key: 'validation:min', values: { min } }),
			max: ({ max, label }) => ({ key: 'validation:max', values: { max } })
		}
	})
}
