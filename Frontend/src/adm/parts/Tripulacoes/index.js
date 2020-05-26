import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import api from '../../../services/api'
import Pagination from  '../../parts/Pagination'

import './styles.css'

export default function Index() {
  const [tripulacoes, setTripulacoes] = useState([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  let {page} = useParams()
  page = page || 1
  const history = useHistory()
  const limit = 12
  let entidade = 'Tripulações'
  let paginate = ''

  useEffect(() => {
    setOffset(limit * (page - 1))
  }, [limit, page])

  useEffect(() => {
    api.get('tripulacao', {
      headers: {
        offset,
        limit
      }
    }).then(response => {
      setTripulacoes(response.data)
      setTotal(response.data[0].total)
    })

  }, [page, offset])

  async function toShow(nome) {
    history.push(`/adm/update/tripulacoes/${nome}`)
  }

  if((Math.ceil(total/limit)) > 1) (
    paginate = (<Pagination total={Math.ceil(total/limit)} entidade={entidade} />)
  )

  return (
    <div>
      <div className="tripulacoes">
        {tripulacoes.map(tripulacao => (
          <div className="tripulacao" onClick={()=> toShow(tripulacao.nome)} key={tripulacao.id}>
            <img src={tripulacao.path} alt={tripulacao.nome} />
            <p>{tripulacao.nome}</p>
          </div>
        ))}
      </div>
      <div className="paginate">
      {paginate}
      </div>
    </div>
  )
}