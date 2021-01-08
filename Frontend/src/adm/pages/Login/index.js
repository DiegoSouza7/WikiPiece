import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Form } from '@unform/web'
import Input from '../../components/Input'
import * as Yup from 'yup'
import api from '../../../services/api'

import './styles.css'

export default function Index() {
  const formRef = useRef(null)
  const history = useHistory()

  async function handleSubmit(data, { reset }) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required('É nescessário um email'),
        password: Yup.string().required('É nescessário uma senha')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      const response = await api.post('adm/login', data)
      if (response.data === 'Senha incorreta') {
        alert(response.data)
        reset()
        return history.push('/login')
      }

      localStorage.setItem('Authorization', `Bearer ${response.data}`)

      formRef.current.setErrors({})

      history.push('/adm')
    } catch (err) {
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
        <button type="submit">Logar</button>
      </Form>
      <button onClick={() => history.push('/forgotPassword')}>Esqueci a Senha</button>
    </section>
  )
}