import { useState, useEffect, createContext, useContext } from 'react'
import { signIn } from 'next-auth/client'

declare const google: any

interface Props {
	children: React.ReactNode
}

export const GoogleOneTapContext = createContext<[string, React.Dispatch<string>]>(undefined)

const GoogleOneTapProvider: React.FC<Props> = ({ children }) => {
	const [idToken, setIdToken] = useState(null)
	const [clientId, setClientId] = useState(null)

	// DISPLAY GOOGLE ONE TAP UI
	useEffect(() => {
		if (clientId) {
			const handleCredentialResponse = (response) => {
				setIdToken(response.credential)
			}

			google.accounts.id.initialize({
				client_id: clientId,
				callback: handleCredentialResponse,
				context: 'use',
				prompt_parent_id: 'google-one-tap',
				cancel_on_tap_outside: false
			})

			setTimeout(() => {
				google.accounts.id.prompt()
			}, 2000)
		}
	}, [clientId])

	// WHEN idToken IS SET, SIGN IN THE USER
	useEffect(() => {
		if (idToken) {
			// Sign in with credential from the Google user.
			signIn('google')
		}
	}, [idToken])

	return <GoogleOneTapContext.Provider value={[clientId, setClientId]}>{children}</GoogleOneTapContext.Provider>
}

export default GoogleOneTapProvider