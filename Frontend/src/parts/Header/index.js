import React, { useRef }  from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import bannerImg from '../../assets/logo.png'
import { Form } from '@unform/web'
import Input from '../../adm/components/Input'

import './styles.css'

export default function Header() {
  const formRef = useRef(null)
	const history = useHistory()

	async function handleSubmit(data, {reset}) {
		try {

      if(data.filter) history.push({
        pathname: '/Search',
        search: data.filter
      })

      reset()
		} catch(err) {
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
              <Link className="links" to="/Personagens">Personagens</Link>
                <ul className="submenu">
                  <li>
                    <Link className="links" to="/Piratas">Piratas</Link>
                  </li>
                  <li>
                    <Link className="links" to="/Marinheiros">Marinheiros</Link>
                  </li>
                  <li>
                    <Link className="links" to="/Revolucionarios">Revolucionários</Link>
                  </li>
                  <li>
                    <Link className="links" to="/GovernoMundial">Governo Mundial</Link>
                  </li>
                  <li>
                    <Link className="links" to="/Outros">Outros</Link>
                  </li>
                </ul>
            </li>
            <li className="escolha">
              <Link className="links" to="/AkumaNoMi">Akumas no mi</Link>
                <ul className="submenu">
                  <li>
                    <Link className="links" to="/Paramecia">Paramecia</Link>
                  </li>
                  <li>
                    <Link className="links" to="/Zoan">Zoan</Link>
                  </li>
                  <li>
                    <Link className="links" to="/Logia">Logia</Link>
                  </li>
                </ul>
            </li>
            <li className="escolha">
              <Link className="links" to="/Recompensas">Recompensas</Link>
            </li>
            <li className="escolha">
              <Link className="links" to="/Tripulações">Tripulações</Link>
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