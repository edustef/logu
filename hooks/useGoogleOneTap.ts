import { useContext, useEffect } from 'react'
import { GoogleOneTapContext } from '../context/googleOneTapProvider'


export const useGoogleOneTap = () => {
	const googleClientId = '187630268462-4qotigsap0ghe6hr5c9rj8ii6tg2dekj.apps.googleusercontent.com'
	const [clientId, setClientId] = useContext(GoogleOneTapContext)

	useEffect(() => {
		setClientId(googleClientId)
	}, [googleClientId])
}
