'use client';
import Table from '@/components/ui/table/Table';
import styles from './Contact.module.scss';
import React, { useCallback, useEffect, useReducer } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Checkbox from '@/components/ui/checkbox/Checkbox';
import LabelInput from '@/components/ui/label-input/LabelInput';

export type ContactFormState = {
	name: string;
	email: string;
	phone: string;
	message: string;
	policyAccept: boolean;
};

type Action = { type: 'SET_FIELD'; field: keyof ContactFormState; value: string | boolean } | { type: 'RESET' };

const initialState: ContactFormState = {
	name: '',
	email: '',
	phone: '',
	message: '',
	policyAccept: false,
};

function reducer(state: ContactFormState, action: Action): ContactFormState {
	switch (action.type) {
		case 'SET_FIELD':
			return { ...state, [action.field]: action.value };
		case 'RESET':
			return initialState;
		default:
			return state;
	}
}

type Props = {};

function ContactFormSection({}: Props) {
	const [state, dispatch] = useReducer(reducer, initialState);

	const handleChange = useCallback(
		(field: keyof ContactFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const value = field === 'policyAccept' ? (e.target as HTMLInputElement).checked : e.target.value;
			dispatch({ type: 'SET_FIELD', field, value });
		},
		[dispatch]
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch({ type: 'RESET' });
	};

	return (
		<Table
			sections={[
				{
					title: 'Gửi tin nhắn cho chúng tôi',
					children: (
						<>
							<form onSubmit={handleSubmit} className={styles.contactForm}>
								<LabelInput
									placeholder='Nhập họ tên của bạn'
									label='Tên của bạn'
									name='name'
									required
									value={state.name}
									onChange={handleChange('name')}
								/>
								<LabelInput
									placeholder='example@gmail.com'
									label='Email của bạn'
									name='email'
									type='email'
									required
									value={state.email}
									onChange={handleChange('email')}
								/>
								<LabelInput
									placeholder='0987654321'
									label='Số điện thoại'
									name='phone'
									type='text'
									required
									value={state.phone}
									onChange={handleChange('phone')}
								/>
								<LabelInput
									placeholder='Nội dung tin nhắn'
									label='Tin nhắn của bạn'
									name='message'
									type='textarea'
									required
									value={state.message}
									onChange={handleChange('message')}
								/>

								<Checkbox
									id='policyAccept'
									checked={state.policyAccept}
									disabled={false}
									onChange={() =>
										dispatch({
											type: 'SET_FIELD',
											field: 'policyAccept',
											value: !state.policyAccept,
										})
									}
									label={
										<>
											Tôi đồng ý với
											<Link className={styles.privacyLink} href='/privacy-policy'>
												Chính sách bảo mật
											</Link>
										</>
									}
								/>
								<button className={clsx(styles.submitButton, 'cta-button')} type='submit'>
									Gửi
								</button>
							</form>
						</>
					),
				},
			]}
			className={styles.contactFormSection}
		/>
	);
}

export default ContactFormSection;
