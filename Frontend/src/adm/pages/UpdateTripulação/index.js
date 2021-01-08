import React, { useRef, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
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
  const [tripulacao, setTripulacao] = useState({})
  const { nome } = useParams()
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
      api.get(`tripulacao/${nome}`).then(response => {
        setTripulacao(response.data)
      })
    }

    Auth()
    Outhers()

  }, [nome, Authorization, history])

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({
        nome: Yup.string().required('* O nome é obrigatório')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      if (data.image !== undefined) {
        const formData = new FormData();
        formData.append("image", data.image)

        const imagem_id = await api.post('adm/imagem', formData, {
          headers: {
            Authorization
          }
        })

        data.imagem_id = imagem_id.data

        await api.put(`adm/tripulacao/${tripulacao.id}`, data, {
          headers: {
            Authorization
          }
        })

        await api.delete('adm/imagem', {
          headers: {
            imagem_id: tripulacao.imagem_id,
            Authorization
          }
        })

        formRef.current.setErrors({})

        history.push('/adm/tripulacao')

      } else {
        await api.put(`adm/tripulacao/${tripulacao.id}`, data, {
          headers: {
            Authorization
          }
        })

        formRef.current.setErrors({})

        history.push('/adm/tripulacao')
      }
    } catch (err) {
      console.error(err)
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {}
        err.inner.forEach(error => {
          errorMessages[error.path] = error.message
        })

        formRef.current.setErrors(errorMessages)
      }
    }
  }

  async function handleDeleteTripulacao(id) {
    try {
      await api.delete(`adm/tripulacao/${id}`, {
        headers: {
          Authorization
        }
      })
      history.push('/adm/tripulacao')
    } catch (error) {
      console.error(error)
      alert('Essa tripulacao está vinculada a algum personagem.')
    }
  }

  return (
    <section className="total">
      <HeaderIndex />
      <div className="createTripulacao">
        <Form id="form" ref={formRef} initialData={tripulacao} onSubmit={handleSubmit}>
          <h1>Nome:</h1>
          <Input name="nome" />
          <h1>Imagem:</h1>
          <div className="photo">
            <div className="photo-upload">
              <ImageInput name="image" src={tripulacao.path} />
              <AiFillFileImage size={30} color="rgb(32, 27, 27)" />
            </div>
          </div>
          <h1>Número de membros:</h1>
          <Input name="numero_membros" />
          <h1>Recompensa Total</h1>
          <Input name="recompensa_total" />
          <h1>Descrição: </h1>
          <Textarea name="descricao" className="descricao" />
        </Form>
        <div className="buttons">
          <button form="form" type="submit">Salvar</button>
          <button onClick={() => handleDeleteTripulacao(tripulacao.id)}>Apagar</button>
        </div>
      </div>
    </section>
  )
}