import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import HeaderIndex from '../../parts/Header'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import Input from '../../components/Input'
import ImageInput from '../../components/ImageInput'
import Textarea from '../../components/Textarea'
import api from '../../../services/api'
import { AiFillFileImage } from 'react-icons/ai'
import './styles.css'

export default function Index() {
  const history = useHistory()
  const formRef = useRef(null)
  const Authorization = localStorage.getItem('Authorization')

  useEffect(() => {
    function Auth() {
      api.get('Auth', {
        headers: {
          Authorization
        }
      }).then(response => {
        return
      }).catch(err => {
        localStorage.clear()
        return history.push('/')
      })
    }

    Auth()
  }, [history, Authorization])

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({
        nome: Yup.string().required('* O nome é obrigatório'),
        tipo: Yup.string().required('* O tipo é obrigatório'),
        image: Yup.mixed().required('Envie uma imagem'),
        descricao: Yup.string().required('Escreva sobre o personagem')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      const formData = new FormData();
      formData.append("image", data.image)

      let imagem_id = await api.post('adm/imagem', formData, {
        headers: {
          Authorization
        }
      })

      imagem_id = imagem_id.data

      const { nome, tipo, descricao } = data

      await api.post('adm/fruta', { nome, tipo, descricao, imagem_id }, {
        headers: {
          Authorization
        }
      })

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
    <section className="total">
      <HeaderIndex />
      <div className="createFruta">
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Nome:</h1>
          <Input name="nome" />
          <h1>Tipo:</h1>
          <Input name="tipo" />
          <h1>Imagem:</h1>
          <div className="photo">
            <div className="photo-upload">
              <ImageInput name="image" />
              <AiFillFileImage size={30} color="rgb(32, 27, 27)" />
            </div>
          </div>
          <h1>Descrição: </h1>
          <Textarea name="descricao" className="descricao" />
          <button type="submit">Salvar</button>
        </Form>
      </div>
    </section>
  )
}