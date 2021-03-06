import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../parts/Pagination'

import './styles.css'

export default function Personagens() {
  const [recompensas, setRecompensas] = useState([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  let { page } = useParams()
  page = page || 1
  const history = useHistory()
  const limit = 12
  let entidade = 'Recompensas'
  let paginate = ''

  useEffect(() => {
    setOffset(limit * (page - 1))
  }, [limit, page])

  useEffect(() => {
    api.get('recompensas', {
      headers: {
        offset,
        limit
      }
    }).then(response => {
      setRecompensas(response.data)
      setTotal(response.data[0].total)
    })

  }, [page, offset])


  async function toShow(nome) {
    history.push(`/Personagens/${nome}`)
  }

  if ((Math.ceil(total / limit)) > 1) (
    paginate = (<Pagination total={Math.ceil(total / limit)} entidade={entidade} />)
  )

  return (
    <div>
      <div className="recompensas">
        {recompensas.map(recompensa => (
          <div className="recompensa" onClick={() => toShow(recompensa.personagem.nome)} key={recompensa.id}>
            <img src={recompensa.path} alt={recompensa.personagem.nome} />
          </div>
        ))}
      </div>
      <div className="paginate">
        {paginate}
      </div>
    </div>
  )
}