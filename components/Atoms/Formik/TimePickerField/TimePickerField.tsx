import dayjs, { Dayjs } from 'dayjs'
import { FieldMetaProps, useField } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import React, { InputHTMLAttributes, useState } from 'react'
import { DatePicker } from '../../../Molecules/Calendar'
import Button from '../../Button'
import Input from '../../Form/Input'
import Label from '../../Form/Label'

interface Props {
	name: string
	className?: string
	parentClassName?: string
	icon?: JSX.Element
	label?: string
}

interface CustomMetaProps extends FieldMetaProps<any> {
	error: any
}

const TimePickerField: React.FC<Props> = ({ label, parentClassName = '', icon, className, name, ...props }) => {
	const { t } = useTranslation()
	const [field, meta, helpers] = useField<Dayjs>(name)
	const customMeta = meta as CustomMetaProps

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let date = field.value

		date = date.set('hour', parseInt(e.target.value.split(':')[0], 10))
		date = date.set('minutes', parseInt(e.target.value.split(':')[1], 10))
		helpers.setValue(date)
	}

	return (
		<div>
			<Label>{label}</Label>
			<Input value={field.value.format('HH:mm')} onChange={handleTimeChange} type='time' />
		</div>
	)
}

export default TimePickerField
