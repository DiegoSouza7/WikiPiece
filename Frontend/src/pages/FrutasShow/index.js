import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import api from '../../services/api'

import HeaderIndex from '../../parts/Header'

import './styles.css'

export default function PersonagensShow() {
	const [fruta, setFruta] = useState({})
	const {nome} = useParams()
	const history = useHistory()

	useEffect(() => {
		api.get(`frutas/${nome}`).then(response => {
			setFruta(response.data)
		})
	}, [nome])

	async function toShow(nome) {
		history.push(`/Personagens/${nome}`)
      }
    
    let usuarios = ''

    if(fruta.usuarios) (
        usuarios = (
			<div className="usuariosFruta">
				{fruta.usuarios.map(usuario => (
                <div onClick={()=> toShow(usuario.nome)} key={usuario.nome}>
                    <img src={usuario.path} alt={usuario.nome}/>
                    <p>{usuario.nome}</p>
                </div>                
            ))}
			</div>
        )
    )

	return (
			<section className="total">
				<HeaderIndex />
				<div className="infos">
					<div className="cabecalho">
						<h1>{fruta.nome}</h1>
						<img className="imgFruta" src={fruta.path} alt={fruta.nome}/>
					</div>

                    <p><strong>Tipo:</strong> {fruta.tipo}</p>
                    <p><strong>Sobre: </strong>{fruta.descricao}</p>
                    <p><strong>Usuários:</strong></p>
                    {usuarios}
				</div>
			</section>
		)
}