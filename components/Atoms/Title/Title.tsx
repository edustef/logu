import clsx from 'clsx'
import BackButton from '../../Molecules/BackButton'
interface Props {
	className?: string
	children: React.ReactNode
	hasBackBtn?: boolean
}

const Title: React.FC<Props> = ({ children, className, hasBackBtn = false }) => {
	return (
		<div className={clsx(className, 'flex items-center')}>
			{hasBackBtn && <BackButton className='mr-2' />}
			<h1 className='mb-3 mt-2 text-2xl font-semibold'>{children}</h1>
		</div>
	)
}

export default Title
