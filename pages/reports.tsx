import React from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../components/Layout'
import Post, { PostProps } from '../components/Post'
import prisma from '../lib/prisma'
import { getSession } from 'next-auth/client'

const ReportsPage = () => {
	return (
		<Layout>
			<div className='page'>
				<h1>Public Feed</h1>
				<main></main>
			</div>
		</Layout>
	)
}

export default ReportsPage

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await getSession({ req })
	
	return {
		props: {},
	}
}
