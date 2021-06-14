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

const DatePickerField: React.FC<Props> = ({ label, parentClassName = '', icon, className, name, ...props }) => {
	const { t } = useTranslation()
	const [field, meta, helpers] = useField<Dayjs>(name)
	const customMeta = meta as CustomMetaProps
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

	const handleDateChange = (date: Dayjs) => {
		let newDate = date

		newDate = newDate.set('hours', field.value.hour())
		newDate = newDate.set('minutes', field.value.minute())
		console.log(newDate)

		helpers.setValue(newDate)
		setIsDatePickerOpen(false)
	}

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let date = field.value

		date = date.set('hour', parseInt(e.target.value.split(':')[0], 10))
		date = date.set('minutes', parseInt(e.target.value.split(':')[1], 10))
		helpers.setValue(date)
	}

	return (
		<div>
			<Label>{label}</Label>
			<div className='flex items-center'>
				<Button className='bg-gray-darkless mr-2' onClick={() => setIsDatePickerOpen(true)}>
					<span className='font-semibold'>{field.value.format('LL')}</span>
				</Button>
			</div>
			<DatePicker
				defaultView='month'
				defaultDate={field.value}
				show={isDatePickerOpen}
				onClose={setIsDatePickerOpen}
				onChange={handleDateChange}
			/>
		</div>
	)
}

export default DatePickerField
