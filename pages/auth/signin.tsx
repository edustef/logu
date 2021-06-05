import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { GetServerSideProps } from 'next'
import { getProviders, signIn, getCsrfToken, getSession } from 'next-auth/client'
import { Provider } from 'next-auth/providers'
import Button from '../../components/Atoms/Button'
import { HomeIcon } from '@heroicons/react/outline'
import LayoutGuest from '../../components/LayoutGuest'
import { useRouter } from 'next/router'
import Link from '../../components/Atoms/Link'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import useTranslation from 'next-translate/useTranslation'
import Title from '../../components/Atoms/Title'

interface Props {
	providers: Provider[]
	csrfToken: string
	callbackUrl: string
	clientId: string
}

const SignIn: React.FC<Props> = ({ providers, csrfToken, callbackUrl }) => {
	const { t } = useTranslation()
	const styles = {
		button: clsx('text-sm font-semibold uppercase px-2 py-1 rounded bg-gray-100 text-black w-full')
	}

	const handleEmailSignIn = async ({ email }: { email: string }, { setSubmitting }) => {
		signIn('email', { email })
	}

	return (
		<LayoutGuest>
			<Link href='/' className='inline-flex items-center'>
				<HomeIcon className='w-6 h-6' />
			</Link>
			<Title>{t('signin:continue')}</Title>
			{Object.values(providers)
				.filter((provider) => provider.name.toLowerCase() !== 'email')
				.map((provider) => (
					<div key={provider.name}>
						<Button
							className='flex items-center justify-center uppercase bg-white text-black w-full'
							onClick={() => signIn(provider.id, { callbackUrl: callbackUrl })}
						>
							<FontAwesomeIcon className='w-4 h-4 mr-2' icon={faGoogle} />
							<span>Sign in with {provider.name}</span>
						</Button>
					</div>
				))}

			<div className='my-6 text-gray-500 flex items-center'>
				<div className='flex-grow border-b border-gray-500'></div>
				<div className='mx-4'>OR</div>
				<div className='flex-grow border-b border-gray-500'></div>
			</div>

			<Formik
				initialValues={{
					email: ''
				}}
				validationSchema={Yup.object({
					email: Yup.string().email().required().label(t('signin:form.email.label'))
				})}
				onSubmit={handleEmailSignIn}
			>
				{({ isSubmitting, errors, touched }) => (
					<Form>
						<>
							<label className='block uppercase text-sm text-gray-400 font-semibold'>
								{t('signin:form.email.label')}
							</label>
							<Field
								className={clsx(
									errors.email && touched.email ? 'border-2 text-red-500 border-red-500' : 'text-black',
									'w-full py-1 px-2 rounded'
								)}
								name='email'
								type='text'
								placeholder='joe@example.com'
							/>
							<ErrorMessage name='email'>
								{({ key, value }: any) => <div className='text-red-400 italic'>{t(key, { field: value })}</div>}
							</ErrorMessage>
							<Button
								disabled={isSubmitting}
								type='submit'
								className='mt-4 w-full text-center bg-white text-black uppercase'
							>
								{t('signin:signWithEmail')}
							</Button>
						</>
					</Form>
				)}
			</Formik>
		</LayoutGuest>
	)
}

export default SignIn

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const session = await getSession({ req })

	if (session) {
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false
			}
		}
	}

	const providers = await getProviders()
	const csrfToken = await getCsrfToken({ req })
	const url = query.callbackUrl ? decodeURIComponent(query.callbackUrl as string) : null
	return {
		props: { providers, csrfToken, callbackUrl: url }
	}
}
