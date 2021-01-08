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

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required('É nescessário um email')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      const response = await api.post('adm/forgotPassword', data)
      alert(response.data)

      formRef.current.setErrors({})
      history.push('/login')
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
        <button className="passowordReset" type="submit">Recuperar Senha</button>
      </Form>
    </section>
  )
}