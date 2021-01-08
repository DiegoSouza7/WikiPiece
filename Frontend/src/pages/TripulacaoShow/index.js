import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import api from '../../services/api'

import HeaderIndex from '../../parts/Header'
import { format } from '../../Utils/format'

import './styles.css'

export default function TripulacaoShow() {
  const [tripulacao, setTripulacao] = useState({})
  const { nome } = useParams()
  const history = useHistory()

  useEffect(() => {
    api.get(`tripulacao/${nome}`).then(response => {
      setTripulacao(response.data)
    })
  }, [nome])

  async function toShow(nome) {
    history.push(`/Personagens/${nome}`)
  }

  let membrosAtuaisConhecidos = '',
    antigosMembros = '',
    numero_membros = '',
    recompensaTotal = '',
    descricao = ''

  if (tripulacao.membrosAtuaisConhecidos) (
    membrosAtuaisConhecidos = (
      <div>
        <p><strong>Membros atuais conhecidos:</strong></p>
        <div className="membrosTripulacao">
          {tripulacao.membrosAtuaisConhecidos.map(membro => (
            <div onClick={() => toShow(membro.nome)} key={membro.nome}>
              <img src={membro.path} alt={membro.nome} />
              <p>{membro.nome}</p>
            </div>
          ))}
        </div>
      </div>
    )
  )

  if (tripulacao.antigosMembros) (
    antigosMembros = (
      <div>
        <p><strong>Antigos membros conhecidos:</strong></p>
        <div className="membrosTripulacao">
          {tripulacao.antigosMembros.map(membro => (
            <div onClick={() => toShow(membro.nome)} key={membro.nome}>
              <img src={membro.path} alt={membro.nome} />
              <p>{membro.nome}</p>
            </div>
          ))}
        </div>
      </div>
    )
  )

  if (tripulacao.numero_membros) (
    numero_membros = (<p><strong>Número de membros:</strong> {tripulacao.numero_membros}</p>)
  )

  if (tripulacao.recompensa_total) (
    recompensaTotal = (<p><strong>Recompensa total: </strong>{format(tripulacao.recompensa_total)}</p>)
  )

  if (tripulacao.descricao) (
    descricao = (<p><strong>Sobre: </strong>{tripulacao.descricao}</p>)
  )

  return (
    <section className="total">
      <HeaderIndex />
      <div className="infos">
        <div className="cabecalho">
          <h1>{tripulacao.nome}</h1>
          <img className="imgTripulacao" src={tripulacao.path} alt={tripulacao.nome} />
        </div>
        {numero_membros}
        {recompensaTotal}
        {membrosAtuaisConhecidos}
        {antigosMembros}
        {descricao}
      </div>
    </section>
  )
}