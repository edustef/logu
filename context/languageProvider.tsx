import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

interface Props {
	children: React.ReactNode
}

export interface Language {
	name: string
	locale: string
}

export const languages: Language[] = [
	{
		name: 'English',
		locale: 'en'
	},
	{
		name: 'Español',
		locale: 'es'
	}
]

export const LanguageContext = React.createContext<[Language, React.Dispatch<Language>]>(undefined)

const LanguageProvider: React.FC<Props> = ({ children }) => {
	const router = useRouter()
	const [currentLanguage, setCurrentLanguage] = useState(
		languages.find((language) => language.locale === router.locale)
	)

	useEffect(() => {
		dayjs.locale(currentLanguage.locale)
	}, [currentLanguage])

	return <LanguageContext.Provider value={[currentLanguage, setCurrentLanguage]}>{children}</LanguageContext.Provider>
}

export default LanguageProvider