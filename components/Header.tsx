import React from 'react'
import LanguageMenu from './LanguageMenu'

const Header: React.FC = () => {
	return (
		<div className='absolute top-0 left-0'>
			<LanguageMenu className='m-2' />
		</div>
	)
}

export default Header
