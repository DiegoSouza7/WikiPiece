import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../parts/Pagination'

import './styles.css'

export default function Personagens({ grupo }) {
  const [personagens, setPersonagens] = useState([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  let { page } = useParams()
  page = page || 1
  const history = useHistory()
  const limit = 12
  let entidade = 'Personagens'
  let paginate = ''

  if (grupo === 'Pirata') entidade = 'Piratas'
  if (grupo === 'Revolucionário') entidade = 'Revolucionarios'
  if (grupo === 'Governo Mundial') entidade = 'GovernoMundial'
  if (grupo === 'Marinheiro') entidade = 'Marinheiros'
  if (grupo === 'Outros') entidade = 'Outros'

  useEffect(() => {
    setOffset(limit * (page - 1))
  }, [limit, page])

  useEffect(() => {
    api.get('index', {
      headers: {
        offset,
        limit,
        grupo: grupo || 'todos'
      }
    }).then(response => {
      setPersonagens(response.data)
      setTotal(response.data[0].total)
    })

  }, [grupo, page, offset])

  async function toShow(nome) {
    history.push(`/Personagens/${nome}`)
  }

  if ((Math.ceil(total / limit)) > 1) (
    paginate = (<Pagination total={Math.ceil(total / limit)} entidade={entidade} />)
  )

  return (
    <div>
      <div className="personagens">
        {personagens.map(personagem => (
          <div className="personagem" onClick={() => toShow(personagem.nome)} key={personagem.id}>
            <img src={personagem.path} alt={personagem.nome} />
            <p>{personagem.nome}</p>
          </div>
        ))}
      </div>
      <div className="paginate">
        {paginate}
      </div>
    </div>
  )
}