import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { GetServerSideProps } from 'next'
import { getProviders, signIn, getCsrfToken } from 'next-auth/client'
import { Provider } from 'next-auth/providers'
import Button from '../../components/Button'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import LayoutGuest from '../../components/LayoutGuest'
import Link from '../../components/Link'
import { useRouter } from 'next/router'

interface Props {
	providers: Provider[]
	csrfToken: string
	callbackUrl: string
}

const SignIn: React.FC<Props> = ({ providers, csrfToken, callbackUrl }) => {
	const router = useRouter()
	const styles = {
		button: clsx('text-sm font-semibold uppercase px-2 py-1 rounded bg-gray-100 text-black w-full')
	}

	return (
		<LayoutGuest>
			<Button onClick={router.back} className='border flex items-center'>
				<ArrowLeftIcon className='w-4 h-4 mr-2' /> <span>Go Back</span>
			</Button>
			<h1 className='uppercase text-xl text-center mb-12 text-gray-500 font-semibold'>Sign Up</h1>
			<form method='post' action='/api/auth/signin/email'>
				<input name='csrfToken' type='hidden' defaultValue={csrfToken} />
				<label className='uppercase text-sm text-gray-400 font-semibold'>
					Email address
					<input placeholder='email@example.com' className='w-full py-2 px-2' type='email' id='email' name='email' />
				</label>
				<Button className='mt-4 w-full text-center bg-white text-black uppercase' type='submit'>
					Sign in with Email
				</Button>
			</form>
			<div className='my-6 text-gray-500 flex items-center'>
				<div className='flex-grow border-b border-gray-500'></div>
				<div className='mx-4'>OR</div>
				<div className='flex-grow border-b border-gray-500'></div>
			</div>
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
		</LayoutGuest>
	)
}

export default SignIn

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const providers = await getProviders()
	const csrfToken = await getCsrfToken({ req })
	const url = query.callbackUrl ? decodeURIComponent(query.callbackUrl as string) : null
	return {
		props: { providers, csrfToken, callbackUrl: url }
	}
}
