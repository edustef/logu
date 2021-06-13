import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React from 'react'
import Button from '../Atoms/Button'

interface Props {
	className?: string
}

const BackButton: React.FC<Props> = ({ className = '' }) => {
	const router = useRouter()

	return (
		<Button className={className} onClick={router.back}>
			<ArrowLeftIcon className='w-6 h-6' />
		</Button>
	)
}

export default BackButton
