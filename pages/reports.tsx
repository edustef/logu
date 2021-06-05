import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Templates/Layout'
import { getSession } from 'next-auth/client'
import Title from '../components/Atoms/Title'
import useTranslation from 'next-translate/useTranslation'

const ReportsPage = () => {
	const { t } = useTranslation()
	return (
		<Layout>
			<div className='page'>
				<Title>{t('navigation:reports')}</Title>
				<main></main>
			</div>
		</Layout>
	)
}

export default ReportsPage

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await getSession({ req })

	return {
		props: {}
	}
}
