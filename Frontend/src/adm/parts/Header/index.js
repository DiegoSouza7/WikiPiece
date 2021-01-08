import React, { useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import bannerImg from '../../../assets/logo.png'
import { Form } from '@unform/web'
import Input from '../../components/Input'
import './styles.css'

export default function Header() {
  const formRef = useRef(null)
  const history = useHistory()

  async function handleSubmit(data, { reset }) {
    try {

      if (data.filter) history.push({
        pathname: '/adm/search',
        search: data.filter
      })

      reset()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <img src={bannerImg} alt="One Piece" />
      <div className="header">
        <nav className="primary">
          <ul>
            <li className="escolha">
              <h1 className="top"> Criar</h1>
              <ul className="submenu">
                <li>
                  <Link className="links" to="/adm/create/frutas">Frutas</Link>
                </li>
                <li>
                  <Link className="links" to="/adm/create/tripulacoes">Tripulações</Link>
                </li>
                <li>
                  <Link className="links" to="/adm/create/personagens">Personagens</Link>
                </li>
                <li>
                  <Link className="links" to="/adm/create/recompensas">Recompensas</Link>
                </li>
              </ul>
            </li>
            <li className="escolha">
              <h1 className="top"> Atualizar</h1>
              <ul className="submenu">
                <li>
                  <Link className="links" to="/adm/frutas">Frutas</Link>
                </li>
                <li>
                  <Link className="links" to="/adm/tripulacao">Tripulações</Link>
                </li>
                <li>
                  <Link className="links" to="/adm/personagens">Personagens</Link>
                </li>
                <li>
                  <Link className="links" to="/adm/recompensas">Recompensas</Link>
                </li>
              </ul>
            </li>
            <li className="escolha">
              <h1 className="top" onClick={() => {
                localStorage.clear()
                history.push('/')
                return
              }}> Sair</h1>
            </li>
            <li>
              <Form ref={formRef} onSubmit={handleSubmit}>
                <Input
                  name="filter"
                  placeholder="Pesquise por personagens, tripulações e akumas no mi"
                />
                <button className="buttonFilter" type="submit">
                  <AiOutlineSearch size={30} color="rgb(32, 27, 27)" />
                </button>
              </Form>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}