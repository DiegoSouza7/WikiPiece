import React, { useRef, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import HeaderIndex from '../../parts/Header'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import Input from '../../components/Input'
import ImageInput from '../../components/ImageInput'
import SelectOptions from '../../components/Select'
import Textarea from '../../components/Textarea'
import api from '../../../services/api'
import { AiFillFileImage } from 'react-icons/ai'
import './styles.css'

export default function Index() {
  let [personagens, setPersonagens] = useState([])
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

    function Outhers() {
      api.get(`adm/personagem`, {
        headers: {
          Authorization
        }
      }).then(response => {
        setPersonagens(response.data)
      })
    }

    Auth()
    Outhers()
  }, [Authorization, history])

  let selects = ''

  if (personagens) {
    selects = (<SelectOptions name="personagem_id" options={personagens} />)
  }

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({
        image: Yup.mixed().required('Envie uma imagem'),
        valor: Yup.number().required('Precisa do valor da recompensa')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      const formData = new FormData();
      formData.append("image", data.image)

      const imagem_id = await api.post('adm/imagem', formData, {
        headers: {
          Authorization
        }
      })

      data.imagem_id = imagem_id.data

      await api.post('adm/recompensa', data, {
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
      <div className="createRecompensa">
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Valor:</h1>
          <Input name="valor" />
          <h1>Imagem:</h1>
          <div className="photo">
            <div className="photo-upload">
              <ImageInput name="image" />
              <AiFillFileImage size={30} color="rgb(32, 27, 27)" />
            </div>
          </div>
          <h1>Personagem:</h1>
          {selects}
          <h1>Evento: </h1>
          <Textarea name="evento" className="descricao" />
          <button type="submit">Salvar</button>
        </Form>
      </div>
    </section>
  )
}