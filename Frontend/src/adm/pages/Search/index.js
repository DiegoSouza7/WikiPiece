import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import api from '../../../services/api'
import HeaderIndex from '../../parts/Header'

import './styles.css'

export default function Search() {
  const [searchs, setSearchs] = useState([])
  const history = useHistory()
  let location = useLocation().search
  location = location.replace('?', '')
  const Authorization = localStorage.getItem('Authorization')

  let personagens = '',
    frutas = '',
    tripulacoes = '',
    notSearchs = ''

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
      api.get('search', {
        headers: {
          location
        }
      }).then(response => {
        setSearchs(response.data)
      })
    }

    Auth()
    Outhers()
  }, [location, Authorization, history])

  if (!searchs.personagens && !searchs.frutas && !searchs.tripulacoes) (
    notSearchs = (
      <div>
        <h1 className="titles">Nenhum resultado encontrado.</h1>
      </div>
    )
  )

  async function toPersonagem(nome) {
    history.push(`/adm/update/personagens/${nome}`)
  }

  if (searchs.personagens) (
    personagens = (
      <div>
        <h1 className="titles">Personagem</h1>
        <div className="personagens">
          {searchs.personagens.map(personagem => (
            <div className="personagem" onClick={() => toPersonagem(personagem.nome)} key={personagem.id}>
              <img src={personagem.path} alt={personagem.nome} />
              <p>{personagem.nome}</p>
            </div>
          ))}
        </div>
      </div>
    )
  )

  async function toFruit(nome) {
    history.push(`/adm/update/frutas/${nome}`)
  }
  if (searchs.frutas) (
    frutas = (
      <div>
        <h1 className="titles">Akuma no mi</h1>
        <div className="frutas">
          {searchs.frutas.map(fruta => (
            <div className="fruta" onClick={() => toFruit(fruta.nome)} key={fruta.id}>
              <img src={fruta.path} alt={fruta.nome} />
              <p>{fruta.nome}</p>
            </div>
          ))}
        </div>
      </div>
    )
  )

  async function toTripulacao(nome) {
    history.push(`/adm/update/tripulacoes/${nome}`)
  }

  if (searchs.tripulacoes) (
    tripulacoes = (
      <div>
        <h1 className="titles">Tripulação</h1>
        <div className="tripulacoes">
          {searchs.tripulacoes.map(tripulacao => (
            <div className="tripulacao" onClick={() => toTripulacao(tripulacao.nome)} key={tripulacao.id}>
              <img src={tripulacao.path} alt={tripulacao.nome} />
              <p>{tripulacao.nome}</p>
            </div>
          ))}
        </div>
      </div>
    )
  )

  return (
    <section className="total">
      <HeaderIndex />
      {notSearchs}
      {personagens}
      {frutas}
      {tripulacoes}
    </section>
  )
}