import { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import '../css/styles.css'
import { Provider } from 'next-auth/client'
import dayjs from 'dayjs'
import calendarPlugin from 'dayjs/plugin/calendar'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import LanguageProvider from '../hooks/useLanguage'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SkeletonTheme } from 'react-loading-skeleton'
import { setLocale } from 'yup'
import GoogleOneTapProvider from '../hooks/useGoogleOneTap'
import Head from 'next/head'

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => {
	const styles = {
		root: clsx([
			'min-h-screen bg-gradient-to-tr',
			'from-gray-100 to-gray-200 text-black',
			'dark:from-gray-800 dark:to-gray-900 dark:text-white'
		])
	}

	// configure dayjs and plugins
	dayjs.extend(localizedFormat)
	dayjs.extend(calendarPlugin)

	// configure Yup validation translation
	setLocale({
		mixed: {
			default: 'validation:invalidField',
			required: ({ label }) => ({ key: 'validation:required', value: label })
		},
		number: {
			min: ({ min }) => ({ key: 'validation:min', value: min }),
			max: ({ max }) => ({ key: 'validation:max', value: max })
		},
		string: {
			email: () => ({ key: 'validation:email' })
		}
	})

	return (
		<>
			<Head>
				<script defer src='https://accounts.google.com/gsi/client' />
			</Head>
			<QueryClientProvider client={queryClient}>
				<Provider
					options={{
						clientMaxAge: 60,
						keepAlive: 5 * 60
					}}
					session={pageProps.session}
				>
					<GoogleOneTapProvider>
						<LanguageProvider>
							<SkeletonTheme color='#374151' highlightColor='#4b5563'>
								<Component {...pageProps} />
							</SkeletonTheme>
						</LanguageProvider>
					</GoogleOneTapProvider>
				</Provider>
			</QueryClientProvider>
		</>
	)
}

export default App
