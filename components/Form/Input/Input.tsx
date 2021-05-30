import clsx from 'clsx'
import { FieldHookConfig, useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	icon: JSX.Element
}

const Input: React.FC<Props> = ({ icon, className, ...props }) => {
	const styles = clsx({
		input: '',
		button: '',
	})

	const [field, meta] = useField(props as FieldHookConfig<any>)

	return (
		<div className={clsx(className, 'relative text-gray-600 focus-within:text-gray-400')}>
			<span className='absolute inset-y-0 left-0 flex items-center pl-2'>
				<span className='p-1 focus:outline-none focus:shadow-outline'>{icon}</span>
			</span>
			<input
				className='py-2 pr-2 text-sm text-white bg-gray-900 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900 '
				{...field}
				{...props}
			/>
		</div>
	)
}

export default Input
