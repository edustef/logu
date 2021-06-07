import { useContext } from 'react'
import { Language, LanguageContext } from '../context/languageProvider'


export const useLanguage = (): [Language, React.Dispatch<Language>] => {
	const [currentLanguage, setCurrentLanguage] = useContext(LanguageContext)

	return [currentLanguage, setCurrentLanguage]
}
