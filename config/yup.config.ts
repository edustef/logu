import { setLocale } from 'yup'
import { onlyWords, startsWithNumber } from '../constants/regex'

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
				
				switch (regex) {
					case startsWithNumber:
						key = 'validation:notNumberFirst'
						break
					case onlyWords:
						key = 'validation:onlyWords'
						break
					default:
						key = 'validation:invalidField'
						break
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
