import clsx from 'clsx'
import { FieldMetaProps, useField } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import React, { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
	parentClassName?: string
	label?: string
}

interface CustomMetaProps extends FieldMetaProps<any> {
	error: any
}

const TextAreaField: React.FC<Props> = ({ label, parentClassName, className, name, ...props }) => {
	const { t } = useTranslation()
	const [field, meta] = useField(name)
	const customMeta = meta as CustomMetaProps

	return (
		<div>
			{label && <label className='block mb-1 uppercase text-sm text-gray-400 font-semibold'>{label}</label>}
			<textarea
				className={clsx(
					className,
					meta.error && meta.touched && 'border border-red-500',
					'p-2 text-gray-600 focus-within:text-black rounded-md'
				)}
				{...field}
				{...props}
			></textarea>
			{meta.error && meta.touched && (
				<div className='text-red-400 mt-1 italic text-sm'>{t(customMeta.error.key, customMeta.error.values)}</div>
			)}
		</div>
	)
}

export default TextAreaField
