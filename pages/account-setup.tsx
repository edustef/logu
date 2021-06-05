import { GetServerSideProps } from 'next'
import React from 'react'

const AccountSetupPage = () => {
  // TODO - Implement Account Setup Page
  // [] Create the default database 'My Workspace'
  // [] Chose to edit your profile

	return <>

  </>
}

export default AccountSetupPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	return {
		props: {}
	}
}
