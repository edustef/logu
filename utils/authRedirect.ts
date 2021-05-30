export default (callbackPath: string) => {
	const callbackUrl = encodeURIComponent(process.env.NEXTAUTH_URL + callbackPath)
	return {
		redirect: {
			destination: `/auth/signin?callbackUrl=${callbackUrl}`,
			permanent: false,
		},
	}
}
