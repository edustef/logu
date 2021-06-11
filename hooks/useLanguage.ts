import { useContext } from 'react'
import { Language } from '../constants/languages'
import { LanguageContext } from '../context/languageProvider'

export const useLanguage = (): [Language, React.Dispatch<Language>] => {
	const [currentLanguage, setCurrentLanguage] = useContext(LanguageContext)

	return [currentLanguage, setCurrentLanguage]
}
