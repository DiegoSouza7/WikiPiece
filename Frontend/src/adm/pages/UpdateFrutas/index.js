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
  const [fruta, setfruta] = useState({})
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
      api.get(`frutas/${nome}`).then(response => {
        setfruta(response.data)
      })
    }

    Auth()
    Outhers()

  }, [nome, history, Authorization])

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({
        nome: Yup.string().required('* O nome é obrigatório'),
        tipo: Yup.string().required('* O tipo é obrigatório'),
        descricao: Yup.string().required('Escreva sobre a fruta')
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

        await api.put(`adm/fruta/${fruta.id}`, data, {
          headers: {
            Authorization
          }
        })

        await api.delete('adm/imagem', {
          headers: {
            imagem_id: fruta.imagem_id,
            Authorization
          }
        })

        formRef.current.setErrors({})

        history.push('/adm/frutas')

      } else {
        await api.put(`adm/fruta/${fruta.id}`, data, {
          headers: {
            Authorization
          }
        })

        formRef.current.setErrors({})

        history.push('/adm/frutas')
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

  async function handleDeleteFruta(id) {
    try {
      await api.delete(`adm/fruta/${id}`, {
        headers: {
          Authorization
        }
      })
      history.push('/adm/frutas')
    } catch (error) {
      console.error(error)
      alert('Essa fruta está vinculada a algum personagem.')
    }
  }

  return (
    <section className="total">
      <HeaderIndex />
      <div className="createFruta">
        <Form id="form" ref={formRef} initialData={fruta} onSubmit={handleSubmit}>
          <h1>Nome:</h1>
          <Input name="nome" />
          <h1>Tipo:</h1>
          <Input name="tipo" />
          <h1>Imagem:</h1>
          <div className="photo">
            <div className="photo-upload">
              <ImageInput name="image" src={fruta.path} />
              <AiFillFileImage size={30} color="rgb(32, 27, 27)" />
            </div>
          </div>
          <h1>Descrição: </h1>
          <Textarea name="descricao" className="descricao" />
        </Form>
        <div className="buttons">
          <button form="form" type="submit">Salvar</button>
          <button onClick={() => handleDeleteFruta(fruta.id)}>Apagar</button>
        </div>
      </div>
    </section>
  )
}