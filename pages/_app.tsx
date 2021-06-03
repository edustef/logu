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
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import { XIcon } from '@heroicons/react/outline'
import XButton from '../components/XButton'
import clsx from 'clsx'

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => {
	const contextClass = {
		success: 'bg-blue-600',
		error: 'bg-red-600',
		info: 'bg-gray-600',
		warning: 'bg-red-400',
		default: 'bg-indigo-600',
		dark: 'bg-gray-darkless'
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
		string: {
			email: () => ({ key: 'validation:email' }),
			min: ({ min }) => ({ key: 'validation:min', value: min }),
			max: ({ max }) => ({ key: 'validation:max', value: max })
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
								<ToastContainer
									toastClassName={({ type }) =>
										clsx(
											contextClass[type || 'default'],
											'relative text-white flex p-1 min-h-10 shadow-md justify-between overflow-hidden cursor-pointer'
										)
									}
									bodyClassName={() => 'text-sm font-white font-med block p-3'}
									position='top-right'
									autoClose={6000}
									draggable={false}
									closeButton={XButton}
								/>
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
