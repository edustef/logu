import { ArrowLeftIcon, CollectionIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { Form, Formik } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import Button from '../../components/Atoms/Button'
import Card from '../../components/Molecules/Card'
import { InputField, TextAreaField } from '../../components/Atoms/Formik'
import Layout from '../../components/Templates/Layout'
import Title from '../../components/Atoms/Title'
import { workspaceDescription, workspaceName, YupWorkspaceData } from '../../schemas/workspace.schema'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import authRedirect from '../../utils/authRedirect'
import { UserWorkspace } from '../../schemas/userWorkspace.schema'
import BackButton from '../../components/Molecules/BackButton'
import accountSetupRedirect from '../../utils/accountSetupRedirect'

const CreatePage: React.FC = () => {
	const { t } = useTranslation()
	const router = useRouter()

	const submit = async (values: YupWorkspaceData, { setSubmitting }) => {
		setSubmitting(true)

		try {
			const { data } = await axios.post<UserWorkspace>(`/api/workspaces`, values)

			toast.success(t('workspaceCreate:success', { name: data.workspace.name }))
			router.push('/account')
		} catch (error) {
			console.log(error.response)

			toast.error(t('workspaceCreate:error'))
		}

		setSubmitting(false)
	}

	return (
		<Layout>
			<Title hasBackBtn>{t('workspaceCreate:title')}</Title>
			<Formik
				initialValues={{
					name: '',
					description: '',
					isIndividual: false
				}}
				validationSchema={Yup.object({
					name: workspaceName.label(t('workspaceCreate:name.label')),
					description: workspaceDescription
				})}
				onSubmit={submit}
			>
				{({ isSubmitting }) => (
					<Form>
						<>
							<Card className='mb-2 space-y-2'>
								<InputField
									className='w-full'
									label={t('workspaceCreate:name.label')}
									icon={<CollectionIcon className='w-full h-full text-current' />}
									name='name'
									type='text'
									placeholder={t('workspaceCreate:name.placeholder')}
								/>
								<TextAreaField
									className='w-full'
									label={t('workspaceCreate:description.label')}
									name='description'
									type='text'
									placeholder={t('workspaceCreate:description.placeholder')}
								/>
							</Card>
							<Button
								disabled={isSubmitting}
								type='submit'
								className='block w-full bg-green-600 text-white disabled:cursor-not-allowed disabled:bg-gray-300 up'
							>
								{t('workspaceCreate:createWorkspace')}
							</Button>
						</>
					</Form>
				)}
			</Formik>
		</Layout>
	)
}

export default CreatePage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req })

	if (!session) {
		return authRedirect('/dashboard')
	}

	if (session.userDetails.isNewUser) {
		return accountSetupRedirect()
	}

	return {
		props: {}
	}
}
