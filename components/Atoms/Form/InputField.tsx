import clsx from 'clsx'
import { FieldMetaProps, useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'
import useTranslation from 'next-translate/useTranslation'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	parentClassName?: string
	icon?: JSX.Element
	label?: string
}

interface CustomMetaProps extends FieldMetaProps<any> {
	error: any
}

const InputField: React.FC<Props> = ({ label, parentClassName, icon, className, name, ...props }) => {
	const { t } = useTranslation()
	const [field, meta] = useField(name)
	const customMeta = meta as CustomMetaProps
	
	return (
		<div className={parentClassName}>
			{label && <label className='block mb-1 uppercase text-sm text-gray-400 font-semibold'>{label}</label>}
			<div className={clsx(className, 'relative inline-block text-gray-400 focus-within:text-gray-600')}>
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
						'py-1 text-gray-600 focus-within:text-black rounded pr-2'
					)}
					{...field}
					{...props}
				/>
			</div>
			{meta.error && meta.touched && (
				<div className='text-red-400 mt-1 italic text-sm'>{t(customMeta.error.key, customMeta.error.values)}</div>
			)}
		</div>
	)
}

export default InputField
