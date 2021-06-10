import { RadioGroup } from '@headlessui/react'
import { CheckIcon, CollectionIcon, UserAddIcon } from '@heroicons/react/outline'
import axios from 'axios'
import clsx from 'clsx'
import { Form, Formik } from 'formik'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { boolean, object, string, StringSchema } from 'yup'
import Avatar from '../components/Atoms/Avatar'
import Button from '../components/Atoms/Button'
import { InputField, TextAreaField } from '../components/Atoms/Form'
import Title from '../components/Atoms/Title'
import Card from '../components/Molecules/Card'
import LayoutGuest from '../components/Templates/LayoutGuest'
import { userImage, userName } from '../schemas/user.schema'
import { workspaceDescription, workspaceName } from '../schemas/workspace.schema'
import authRedirect from '../utils/authRedirect'
import homeRedirect from '../utils/homeRedirect'

interface Values {
	name: string
	image: string
	option: {
		name: string
		description: string
	}
	email: string
	workspace: {
		name: string
		description: string
	}
}

const options = [
	{
		name: 'accountSetup:options.individual.name',
		description: 'accountSetup:options.individual.description'
	},
	{
		name: 'accountSetup:options.withTeam.name',
		description: 'accountSetup:options.withTeam.description'
	}
]

const AccountSetupPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation()
	const router = useRouter()
	const [optionSelected, setOptionSelected] = useState(options[0])

	const isIndividual = () => {
		return options[0].name === optionSelected.name
	}

	const submit = async (values: Values) => {
		try {
			await axios.put(`/api/users/${user.id}`, { name: values.name, isNewUser: false })

			if (isIndividual()) {
				await axios.post(`/api/workspaces`, {
					name: t('accountSetup:individualWorkspace.name.defaultValue'),
					description: t('accountSetup:individualWorkspace.defaultDescriptionValue')
				})
			} else {
				await axios.post(`/api/workspaces`, {
					name: values.workspace.name,
					description: values.workspace.description
				})
			}

			router.replace('/dashboard')
		} catch (error) {
			console.log(error.response)
		}
	}

	return (
		<LayoutGuest>
			<div className='max-w-lg mx-auto'>
				<Title className='text-center'>{t('accountSetup:title')}</Title>
				<Formik
					enableReinitialize={true}
					initialValues={{
						name: user.name ?? '',
						image: user.image ?? '',
						option: options[0],
						workspace: {
							name: '',
							description: ''
						},
						email: user.email
					}}
					validationSchema={object({
						name: userName.label(t('accountSetup:name.label')),
						image: userImage.label(t('accountSetup:image.label')),
						option: object({
							name: string(),
							description: string()
						}),
						workspace: object({
							name: string().when('option', () => {
								if (optionSelected.name === options[1].name) {
									return workspaceName.label(t('accountSetup:teamWorkspace.name.label'))
								}
							}),
							description: string().when('option', () => {
								if (optionSelected.name === options[1].name) {
									return workspaceDescription.label(t('accountSetup:teamWorkspace.description.label'))
								}
							})
						})
					})}
					onSubmit={submit}
				>
					{({ isSubmitting, values, setFieldValue }) => (
						<Form>
							<>
								<div className='grid place-items-center'>
									{user.image && <Avatar className='mb-4' url={user.image} />}
									{!user.image && values.name && (
										<Avatar className='mb-4' name={values.name ?? t('accountSetup:name.placeholder')} />
									)}
								</div>
								<Card className='mb-2 space-y-2'>
									<InputField
										className='w-full'
										label={t('accountSetup:name.label')}
										icon={<UserAddIcon className='w-full h-full text-current' />}
										name='name'
										type='text'
										placeholder={t('accountSetup:name.placeholder')}
									/>
								</Card>
								<RadioGroup className='my-4' value={optionSelected} onChange={setOptionSelected}>
									<RadioGroup.Label className='sr-only'>Server size</RadioGroup.Label>
									<div className='space-y-2'>
										{options.map((option) => (
											<RadioGroup.Option
												key={option.name}
												value={option}
												className={({ active, checked }) =>
													clsx(
														active ? 'ring-2 ring-offset-2 ring-offset-light-blue-300 ring-white ring-opacity-60' : '',
														checked ? 'bg-indigo-700' : 'bg-gray-700',
														'relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none'
													)
												}
											>
												{({ active, checked }) => (
													<>
														<div className='flex items-center justify-between w-full'>
															<div className='flex items-center'>
																<div>
																	<RadioGroup.Label
																		as='p'
																		className={clsx('font-medium', checked ? 'text-white' : 'text-gray-300')}
																	>
																		{t(option.name)}
																	</RadioGroup.Label>
																	<RadioGroup.Description
																		as='div'
																		className={clsx('text-sm max-w-sm', checked ? 'text-white' : 'text-gray-400')}
																	>
																		{t(option.description)}
																	</RadioGroup.Description>
																</div>
															</div>
															{checked && (
																<div className='flex-shrink-0 text-white'>
																	<CheckIcon className='w-6 h-6' />
																</div>
															)}
														</div>
													</>
												)}
											</RadioGroup.Option>
										))}
									</div>
								</RadioGroup>
								{!isIndividual() && (
									<Card className='mb-2'>
										<InputField
											className='w-full'
											label={t('accountSetup:teamWorkspace.name.label')}
											icon={<CollectionIcon className='w-full h-full text-current' />}
											name='workspace.name'
											type='text'
											placeholder={t('accountSetup:teamWorkspace.name.placeholder')}
										/>
										<TextAreaField
											className='w-full'
											label={t('accountSetup:teamWorkspace.description.label')}
											name='workspace.description'
											type='text'
											placeholder={t('accountSetup:teamWorkspace.description.placeholder')}
										/>
									</Card>
								)}
								<Button
									disabled={isSubmitting}
									type='submit'
									className='block w-full bg-green-600 text-white disabled:cursor-not-allowed disabled:bg-gray-300 up'
								>
									{t('accountSetup:confirmSetup')}
								</Button>
							</>
						</Form>
					)}
				</Formik>
			</div>
		</LayoutGuest>
	)
}

export default AccountSetupPage

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
	const session = await getSession({ req })

	if (!session) {
		return authRedirect(req.url)
	}

	if (!session.userDetails.isNewUser) {
		return homeRedirect()
	}

	return {
		props: { user: session.userDetails }
	}
}
