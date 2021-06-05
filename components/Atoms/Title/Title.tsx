import clsx from 'clsx'
interface Props{
	className: string,
	children: React.ReactNode
}

const Title: React.FC<Props> = ({ children, className }) => {
	return <h1 className={clsx(className, 'mb-3 mt-2 text-2xl font-semibold')}>{children}</h1>
}

export default Title
