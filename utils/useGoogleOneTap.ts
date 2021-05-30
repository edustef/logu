import { useState, useContext, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/client'

declare var google: any

export const useGoogleOneTap = (clientId: string) => {
	const [idToken, setIdToken] = useState(null)

	useEffect(() => {
		const handleCredentialResponse = (response) => {
			setIdToken(response.credential)
		}

		google.accounts.id.initialize({
			client_id: clientId,
			callback: handleCredentialResponse,
			context: 'use',
			prompt_parent_id: 'put-google-one-tap-here-plz'
		})

		setTimeout(() => {
			google.accounts.id.prompt((notification) => {
				console.log('notification is: ', notification.getMomentType())
				if (notification.isDisplayMoment()) {
					console.log('IS DISPLAY MOMENT')
				}
			})
		}, 4000)
	}, [])

	useEffect(() => {
		if (idToken) {
			// Sign in with credential from the Google user.
			signIn('google')
		}
	}, [idToken])
}
