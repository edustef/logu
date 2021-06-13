import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import languages, { Language } from '../constants/languages'

interface Props {
	children: React.ReactNode
}

export const LanguageContext = React.createContext<[Language, React.Dispatch<Language>]>(undefined)

const LanguageProvider: React.FC<Props> = ({ children }) => {
	const router = useRouter()

	const [currentLanguage, setCurrentLanguage] = useState(
		languages.find((language) => language.locale === router.locale)
	)

	useEffect(() => {
		dayjs.locale(currentLanguage.locale === 'en' ? 'en-gb' : 'es')
	}, [currentLanguage])

	return <LanguageContext.Provider value={[currentLanguage, setCurrentLanguage]}>{children}</LanguageContext.Provider>
}

export default LanguageProvider
