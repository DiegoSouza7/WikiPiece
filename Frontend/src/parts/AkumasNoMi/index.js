import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../parts/Pagination'

import './styles.css'

export default function Frutas({ grupo }) {
  const [frutas, setFrutas] = useState([])
  let { page } = useParams()
  page = page || 1
  const [total, setTotal] = useState(0)
  const history = useHistory()
  const [offset, setOffset] = useState(0)
  const limit = 12
  let entidade = 'AkumaNoMi'
  let paginate = ''

  if (grupo === 'Paramecia') entidade = 'Paramecia'
  if (grupo === 'Logia') entidade = 'Logia'
  if (grupo === 'Zoan') entidade = 'Zoan'

  useEffect(() => {
    setOffset(limit * (page - 1))
  }, [limit, page])

  useEffect(() => {
    api.get('frutas', {
      headers: {
        offset,
        limit,
        grupo: grupo || 'todos'
      }
    }).then(response => {
      setFrutas(response.data)
      setTotal(response.data[0].total)
    })

  }, [grupo, page, offset])

  async function toShow(nome) {
    history.push(`/AkumaNoMi/${nome}`)
  }

  if ((Math.ceil(total / limit)) > 1) (
    paginate = (<Pagination total={Math.ceil(total / limit)} entidade={entidade} />)
  )

  return (
    <div>
      <div className="frutas">
        {frutas.map(fruta => (
          <div className="fruta" onClick={() => toShow(fruta.nome)} key={fruta.id}>
            <img src={fruta.path} alt={fruta.nome} />
            <p>{fruta.nome}</p>
          </div>
        ))}
      </div>
      <div className="paginate">
        {paginate}
      </div>
    </div>
  )
}