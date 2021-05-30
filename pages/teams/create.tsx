import { Workspace } from '.prisma/client'
import axios from 'axios'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import * as Yup from 'yup'
import Button from '../../components/Button'
import Layout from '../../components/Layout'

export default function CreatePage() {
	const { t } = useTranslation()
	const submitNewWorkspace = async (values: any, { setSubmitting }) => {
		try {
			setSubmitting(true)
			const res = await axios.post<Workspace>(`/api/workspaces`, {
				headers: { 'Content-Type': 'application/json' },
				data: { ...values }
			})
		} catch (error) {
			console.error(error)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Layout>
			<Formik
				initialValues={{
					workspace: ''
				}}
				validationSchema={Yup.object({
					workspace: Yup.string()
						.min(3, t('validation:min', { num: 3 }))
						.max(15, t('validation:max', { num: 15 }))
						.required('Required')
				})}
				onSubmit={submitNewWorkspace}
			>
				{({ isSubmitting, errors, touched }) => (
					<Form>
						<>
							<Button
								disabled={isSubmitting}
								type='submit'
								className='bg-green-200 text-black disabled:cursor-not-allowed disabled:bg-gray-300'
							>
								{t('account:addWorkspace')}
							</Button>
							<Field
								className={errors.workspace && touched.workspace ? 'border border-red-500' : ''}
								name='workspace'
								type='text'
								placeholder='Ex: Customer Support'
							/>
							<ErrorMessage name='workspace' />
						</>
					</Form>
				)}
			</Formik>
		</Layout>
	)
}
