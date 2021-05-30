import { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import '../css/styles.css'
import { Provider } from 'next-auth/client'
import clsx from 'clsx'
import dayjs from 'dayjs'
import calendarPlugin from 'dayjs/plugin/calendar'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import LanguageProvider from '../context/useLanguage'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SkeletonTheme } from 'react-loading-skeleton'

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

	return (
		<QueryClientProvider client={queryClient}>
			<Provider
				options={{
					clientMaxAge: 60,
					keepAlive: 5 * 60
				}}
				session={pageProps.session}
			>
				<LanguageProvider>
					<SkeletonTheme color='#374151' highlightColor='#4b5563'>
						<Component {...pageProps} />
					</SkeletonTheme>
				</LanguageProvider>
			</Provider>
		</QueryClientProvider>
	)
}

export default App
