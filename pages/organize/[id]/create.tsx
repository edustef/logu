import React, { useState } from 'react'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Layout from '../../../components/Templates/Layout'
import Title from '../../../components/Atoms/Title'
import { getSession } from 'next-auth/client'
import Card from '../../../components/Molecules/Card'
import useTranslation from 'next-translate/useTranslation'
import authRedirect from '../../../utils/authRedirect'
import { getWorkspace } from '../../api/workspaces/[id]'
import StatusCode from 'status-code-enum'
import accountSetupRedirect from '../../../utils/accountSetupRedirect'
import parseQueryOne from '../../../utils/parseQueryOne'
import { WorkspaceWithUsers } from '../../../schemas/userWorkspace.schema'
import { Form, Formik } from 'formik'
import { InputField, TimePickerField, TextAreaField } from '../../../components/Atoms/Formik'
import { Input } from '../../../components/Atoms/Form'
import dayjs, { Dayjs } from 'dayjs'
import DateTimePickerField from '../../../components/Atoms/Formik/DateTimePickerField'
import clsx from 'clsx'
import Button from '../../../components/Atoms/Button'
import axios from 'axios'
import { User } from '@prisma/client'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

interface Values {
	name: string
	description: string
	start: Dayjs
	end: Dayjs
}

const CreateSchedulePage = ({ workspace, user, date }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()
	const router = useRouter()

	const handleSubmit = async (values: Values, { setSubmitting }) => {
		try {
			const res = axios.post('/api/schedules', {
				...values,
				userWorkspaceId: workspace.users.find((userWorkspace) => user.id === userWorkspace.user.id).id
			})

			toast.success(t('organize:form.success'))
			router.push(`/organize/${workspace.id}`)
		} catch (error) {
			toast.error(t('error:failedPost'))
			console.log(error)
		}

		setSubmitting(false)
	}

	return (
		<Layout>
			<Title hasBackBtn>{t('organize:title')}</Title>
			<Formik
				initialValues={{
					name: '',
					description: '',
					start: dayjs(date).set('hours', 9).set('minutes', 0),
					end: dayjs(date).set('hours', 17).set('minutes', 0)
				}}
				onSubmit={handleSubmit}
			>
				{({ values, isSubmitting }) => (
					<>
						<Form>
							<Card className='space-y-4'>
								<InputField
									className='w-full'
									label={t('organize:form.name.label')}
									name='name'
									type='text'
									placeholder={t('organize:form.name.placeholder')}
								/>
								<TextAreaField
									className='w-full'
									label={t('organize:form.description.label')}
									name='description'
									type='text'
									placeholder={t('organize:form.description.placeholder')}
								/>
								<DateTimePickerField label={t('organize:form.start.label')} name='start' />
								<DateTimePickerField label={t('organize:form.end.label')} name='end' />
							</Card>
							<Button
								type='submit'
								disabled={isSubmitting}
								className={clsx(isSubmitting && 'disabled:cursor-not-allowed bg-gray-600', 'w-full bg-green-600 mt-3')}
							>
								{t('organize:form.submit')}
							</Button>
						</Form>
					</>
				)}
			</Formik>
		</Layout>
	)
}

export default CreateSchedulePage

export const getServerSideProps = async ({ req, params, res, query }: GetServerSidePropsContext) => {
	const session = await getSession({ req })
	if (!session) {
		return authRedirect(req.url)
	}

	if (session.userDetails.isNewUser) {
		return accountSetupRedirect()
	}

	const id = parseQueryOne(params.id)
	console.log(params, query);
	
	const date = parseQueryOne(query.date)
	const workspace = await getWorkspace(id)

	if (!workspace) {
		res.statusCode = StatusCode.ClientErrorNotFound
		res.end()
	}

	if (!workspace.users.find(({ user }) => user.id === session.userDetails.id)) {
		res.statusCode = StatusCode.ClientErrorForbidden
		res.end()
	}

	return {
		props: {
			workspace: JSON.parse(JSON.stringify(workspace)) as WorkspaceWithUsers,
			date: date,
			user: JSON.parse(JSON.stringify(session.userDetails)) as User
		}
	}
}
