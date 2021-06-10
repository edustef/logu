import clsx from 'clsx'
import BackButton from '../../Molecules/BackButton'
interface Props {
	className?: string
	children: React.ReactNode
	hasBackBtn?: boolean
	position?: 'start' | 'center' | 'end'
}

const Title: React.FC<Props> = ({ children, className, hasBackBtn = false, position = 'left' }) => {
	return (
		<div className={clsx(className, 'flex items-center relative', `justify-${position}`)}>
			{hasBackBtn && <BackButton className='absolute left-0 mr-2' />}
			<h1 className={clsx('mb-3 mt-2 text-2xl font-semibold', hasBackBtn && position === 'start' && 'ml-12')}>
				{children}
			</h1>
		</div>
	)
}

export default Title
