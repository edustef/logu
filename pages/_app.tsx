import { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import '../css/styles.css'
import { Provider } from 'next-auth/client'
import LanguageProvider from '../context/languageProvider'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SkeletonTheme } from 'react-loading-skeleton'
import GoogleOneTapProvider from '../context/googleOneTapProvider'
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import XButton from '../components/Atoms/XButton'
import clsx from 'clsx'
import { dayjsConfig } from '../config/dayjs.config'
import yupConfig from '../config/yup.config'
import NotificationsProvider from '../context/notificationsProvider'

const queryClient = new QueryClient()

// Configure yup locale validation
yupConfig()

const App = ({ Component, pageProps }: AppProps) => {
	const contextClass = {
		success: 'bg-green-600',
		error: 'bg-red-600',
		info: 'bg-gray-600',
		warning: 'bg-red-400',
		default: 'bg-indigo-600',
		dark: 'bg-gray-darkless'
	}

	// configure dayjs and plugins
	dayjsConfig()

	return (
		<>
			<Head>
				<script defer src='https://accounts.google.com/gsi/client' />
			</Head>
			<QueryClientProvider client={queryClient}>
				<Provider
					options={{
						clientMaxAge: 60,
						keepAlive: 2 * 60
					}}
					session={pageProps.session}
				>
					<GoogleOneTapProvider>
						<LanguageProvider>
							<NotificationsProvider>
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
							</NotificationsProvider>
						</LanguageProvider>
					</GoogleOneTapProvider>
				</Provider>
			</QueryClientProvider>
		</>
	)
}

export default App
