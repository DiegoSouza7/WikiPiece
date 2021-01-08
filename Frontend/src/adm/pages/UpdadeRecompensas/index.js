import React, { useRef, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
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
  const [recompensa, setRecompensa] = useState({})
  const history = useHistory()
  const formRef = useRef(null)
  const { id } = useParams()
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
      api.get(`recompensas/${id}`).then(response => {
        setRecompensa(response.data)
      })
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

  }, [id, Authorization, history])

  const [valueDefaultPersonagem] = personagens.filter(personagem => personagem.value === recompensa.personagem_id)

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({
        valor: Yup.number().required('Precisa do valor da recompensa')
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

        await api.put(`adm/recompensa/${recompensa.id}`, data, {
          headers: {
            Authorization
          }
        })

        await api.delete('adm/imagem', {
          headers: {
            imagem_id: recompensa.imagem_id,
            Authorization
          }
        })

        formRef.current.setErrors({})

        history.push('/adm/recompensas')

      } else {
        await api.put(`adm/recompensa/${recompensa.id}`, data, {
          headers: {
            Authorization
          }
        })

        formRef.current.setErrors({})

        history.push('/adm/recompensas')
      }
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

  async function handleDeleteRecompensa(id) {
    try {
      await api.delete(`adm/recompensa/${id}`, {
        headers: {
          Authorization
        }
      })
      history.push('/adm/recompensas')
    } catch (error) {
      console.error(error)
      alert('Ocorreu algum erro.')
    }
  }
  return (
    <section className="total">
      <HeaderIndex />
      <div className="createRecompensa">
        <Form id="form" ref={formRef} initialData={recompensa} onSubmit={handleSubmit}>
          <h1>Valor:</h1>
          <Input name="valor" />
          <h1>Imagem:</h1>
          <div className="photo">
            <div className="photo-upload">
              <ImageInput name="image" src={recompensa.path} />
              <AiFillFileImage size={30} color="rgb(32, 27, 27)" />
            </div>
          </div>
          <h1>Personagem:</h1>
          <SelectOptions name="personagem_id" value={valueDefaultPersonagem} options={personagens} />
          <h1>Evento: </h1>
          <Textarea name="evento" className="descricao" />
        </Form>
        <div className="buttons">
          <button form="form" type="submit">Salvar</button>
          <button onClick={() => handleDeleteRecompensa(recompensa.id)}>Apagar</button>
        </div>
      </div>
    </section>
  )
}