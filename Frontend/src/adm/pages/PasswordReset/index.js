import React, { useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Form } from '@unform/web'
import Input from '../../components/Input'
import * as Yup from 'yup'
import api from '../../../services/api'

import './styles.css'

export default function Index() {
    const formRef = useRef(null)
    const history = useHistory()
    let location = useLocation().search
	location = location.replace('?', '')

    async function handleSubmit(data, {reset}) {
		try {
			const schema = Yup.object().shape({
				email: Yup.string().email().required('É nescessário um email'),
                password: Yup.string().required('É nescessário uma senha'),
                passwordRepeat: Yup.string().required('É nescessário repetir a senha')
			})

			await schema.validate(data, {
				abortEarly: false
			})

			if(data.password !== data.passwordRepeat) return alert('senhas não batem')

			const { email, password } = data
            
			await api.post('adm/passwordReset', {email, password, location})

			reset()
			
			alert('Senha alterada com sucesso')
			
			formRef.current.setErrors({})
			history.push('/login')
		} catch(err) {
			if (err instanceof Yup.ValidationError) {
				const errorMessages = {}
				err.inner.forEach(error => {
					errorMessages[error.path] = error.message
				})

				formRef.current.setErrors(errorMessages)
			}
		}
	}
	return (
		<section className="login">
			<Form ref={formRef} onSubmit={handleSubmit}>
				<h1 className="h1Login">Email</h1>
				<Input name="email" type="email" />
				<h1 className="h1Login">Senha</h1>
				<Input name="password" type="password" />
				<h1 className="h1confirmPassword">Confirme a senha</h1>
				<Input name="passwordRepeat" type="password" />
				<button className="resetPassword" type="submit">Refefinir Senha</button>
			</Form>
		</section>
	)
}