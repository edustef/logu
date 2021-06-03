import clsx from 'clsx'
import { useField } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import React, { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	parentClassName?: string
	icon?: JSX.Element
	label?: string
}

const InputField: React.FC<Props> = ({ label, parentClassName, icon, className, name, ...props }) => {
	const { t } = useTranslation()
	const [field, meta, helpers] = useField(name)

	return (
		<div className={parentClassName}>
			{label && <label className='block mb-1 uppercase text-sm text-gray-400 font-semibold'>{label}</label>}
			<div className={clsx(className, 'relative text-gray-400 focus-within:text-gray-600')}>
				{icon && (
					<span className='p-2 absolute inset-y-0 left-0 flex items-center'>
						<span className='w-5 h-5'>{icon}</span>
					</span>
				)}
				<input
					className={clsx(
						className,
						meta.error && meta.touched && 'border border-red-500',
						icon ? 'pl-8' : 'pl-2',
						'py-1 text-black rounded-md pr-2'
					)}
					{...field}
					{...props}
				/>
			</div>
			{meta.error && meta.touched && <div className='text-red-400 italic text-sm'>{meta.error}</div>}
		</div>
	)
}

export default InputField
