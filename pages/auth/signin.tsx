import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getProviders, signIn, getCsrfToken, getSession } from 'next-auth/client'
import { Provider } from 'next-auth/providers'
import Button from '../../components/Atoms/Button'
import { HomeIcon, MailIcon } from '@heroicons/react/outline'
import LayoutGuest from '../../components/Templates/LayoutGuest'
import { useRouter } from 'next/router'
import Link from '../../components/Atoms/Link'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import useTranslation from 'next-translate/useTranslation'
import Title from '../../components/Atoms/Title'
import { InputField } from '../../components/Atoms/Form'
import Card from '../../components/Molecules/Card'

const SignIn: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ providers, callbackUrl }) => {
	const { t } = useTranslation()

	const handleEmailSignIn = async ({ email }: { email: string }) => {
		const res = await signIn('email', { email, callbackUrl })
	}

	return (
		<LayoutGuest>
			<Link href='/' className='inline-flex items-center'>
				<HomeIcon className='w-6 h-6' />
			</Link>
			<Title>{t('signin:continue')}</Title>
			<Card>
				{Object.values(providers)
					.filter((provider) => provider.name.toLowerCase() !== 'email')
					.map((provider) => (
						<div key={provider.name}>
							<Button
								className='flex items-center justify-center uppercase bg-white text-black w-full'
								onClick={() => signIn(provider.id, { callbackUrl })}
							>
								<FontAwesomeIcon className='w-4 h-4 mr-2' icon={faGoogle} />
								<span>{provider.name}</span>
							</Button>
						</div>
					))}

				<div className='my-3 text-gray-500 flex items-center'>
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
								<InputField
									label={t('signin:form.email.label')}
									className='w-full'
									icon={<MailIcon className='w-full h-full text-current' />}
									name='email'
									type='email'
									placeholder={t('signin:form.email.placeholder')}
								/>
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
			</Card>
		</LayoutGuest>
	)
}

export default SignIn

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
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
	const url = query.callbackUrl ? decodeURIComponent(query.callbackUrl as string) : null
	return {
		props: { providers, callbackUrl: url }
	}
}
