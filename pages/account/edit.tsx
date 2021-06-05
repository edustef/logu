import { User, Workspace } from '.prisma/client'
import { CollectionIcon, UserIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import Button from '../../components/Atoms/Button'
import Card from '../../components/Molecules/Card'
import InputField from '../../components/Atoms/InputField'
import Layout from '../../components/Templates/Layout'
import Title from '../../components/Atoms/Title'
import prisma from '../../utils/prisma'
import authRedirect from '../../utils/authRedirect'

interface Props {
	user: User
}
interface FormValues {
	name: string
	image: string
}

const EditAccountPage: React.FC<Props> = ({ user }) => {
	const { t } = useTranslation()
	const router = useRouter()

	const submit = async (values: FormValues, { setSubmitting }) => {
		try {
			setSubmitting(true)
			const res = await axios.put<User>(`/api/users`, {
				headers: { 'Content-Type': 'application/json' },
				data: { ...values }
			})

			toast.success(t('account:edit.success'))
			router.push('/account')
		} catch (error) {
			toast.error(t('account:edit.error'))
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Layout>
			<Title>{t('account:edit.title')}</Title>
			<Formik
				initialValues={{
					name: user.name,
					image: ''
				}}
				validationSchema={Yup.object({
					name: Yup.string()
						.matches(/^[a-zA-Z]+( [a-zA-Z]+)*$/, t('account:edit.notValidName', { field: t('account:edit.nameLabel') }))
						.required(t('validation:required', { field: t('account:edit.nameLabel') }))
				})}
				onSubmit={submit}
			>
				{({ isSubmitting }) => (
					<Form>
						<>
							<Card className='mb-2'>
								<InputField
									className='w-full'
									label={t('account:edit.nameLabel')}
									icon={<UserIcon className='w-full h-full text-current' />}
									name='name'
									type='text'
								/>
							</Card>
							<Button
								disabled={isSubmitting}
								type='submit'
								className='block w-full bg-green-600 text-white disabled:cursor-not-allowed disabled:bg-gray-300 up'
							>
								{t('account:edit.submit')}
							</Button>
						</>
					</Form>
				)}
			</Formik>
		</Layout>
	)
}

export default EditAccountPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req })
	if (!session) {
		return authRedirect('/account')
	}

	return {
		props: { user: JSON.parse(JSON.stringify(session.userDetails)) }
	}
}
