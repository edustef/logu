import clsx from 'clsx'
import BackButton from '../../Molecules/BackButton'
interface Props {
	className?: string
	children: React.ReactNode
	hasBackBtn?: boolean
	position?: 'start' | 'center' | 'end'
}

const Title: React.FC<Props> = ({ children, className, hasBackBtn = false, position = 'start' }) => {
	return (
		<div className={clsx(className, 'flex flex-wrap items-center relative', `justify-${position}`)}>
			{hasBackBtn && <BackButton className='absolute left-0 mr-2' />}
			<h1 className={clsx('mb-3 mt-2 text-2xl font-semibold line-clamp-1', hasBackBtn && position === 'start' && 'ml-12')}>
				{children}
			</h1>
		</div>
	)
}

export default Title
