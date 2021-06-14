import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import LayoutGuest from '../../components/Templates/LayoutGuest'
import Title from '../../components/Atoms/Title'

const AuthErrorPage = () => {
	const { t } = useTranslation()
	const {
		query: { error }
	} = useRouter()

	return (
		<LayoutGuest>
			<div className='h-full flex flex-col items-center justify-center'>
				<Title className='text-center'>{t('errors:failedPost')}</Title>
				{error && <div className='text-center'>{t(`errors:auth.${error}`)}</div>}
			</div>
		</LayoutGuest>
	)
}

export default AuthErrorPage
