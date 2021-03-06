import { ArrowLeftIcon, UserIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { object } from 'yup'
import Avatar from '../../components/Atoms/Avatar'
import Button from '../../components/Atoms/Button'
import { InputField } from '../../components/Atoms/Formik'
import Link from '../../components/Atoms/Link'
import Title from '../../components/Atoms/Title'
import Card from '../../components/Molecules/Card'
import Layout from '../../components/Templates/Layout'
import { YupUserData, userImage, userName } from '../../schemas/user.schema'
import authRedirect from '../../utils/authRedirect'

const EditAccountPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()
	const router = useRouter()
	const submit = async (values: YupUserData, asd) => {
		try {
			const res = await axios.put(`/api/users/${user.id}`, values)

			toast.success(t('accountEdit:success'))
			router.push('/account')
		} catch (error) {
			console.log(error)

			toast.error(t('accountEdit:error'))
		}
	}

	return (
		<Layout>
			<Title hasBackBtn position='center'>
				{t('accountEdit:title')}
			</Title>
			<Formik
				enableReinitialize={true}
				initialValues={{
					name: user.name ?? '',
					image: user.image ?? '',
					email: user.email
				}}
				validationSchema={object({
					name: userName.label(t('accountEdit:name.label')),
					image: userImage.label(t('accountEdit:image.label'))
				})}
				onSubmit={submit}
			>
				{({ isSubmitting, values }) => (
					<Form>
						<>
							<Card className='mb-2 space-y-2'>
								<InputField
									className='w-full'
									label={t('accountEdit:name.label')}
									icon={<UserIcon className='w-full h-full text-current' />}
									name='name'
									type='text'
									placeholder={t('common:namePlaceholder')}
								/>
							</Card>
							<Button
								disabled={isSubmitting}
								type='submit'
								className='block w-full bg-green-600 text-white disabled:cursor-not-allowed disabled:bg-gray-300 up'
							>
								{t('accountEdit:submit')}
							</Button>
						</>
					</Form>
				)}
			</Formik>
		</Layout>
	)
}

export default EditAccountPage

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
	const session = await getSession({ req })

	if (!session) {
		return authRedirect(req.url)
	}

	return {
		props: { user: session.userDetails }
	}
}
