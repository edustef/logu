import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import LayoutGuest from '../../components/Templates/LayoutGuest'
import { MailOpenIcon } from '@heroicons/react/outline'

const AuthVerifyRequestPage = () => {
	const { t } = useTranslation()
	return (
		<LayoutGuest>
			<div className='h-full flex flex-col items-center justify-center'>
				<MailOpenIcon className='w-24 h-24' />
				<div className='text-center'>{t('common:verifyRequest')}</div>
			</div>
		</LayoutGuest>
	)
}

export default AuthVerifyRequestPage
