import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import api from '../../services/api'

import HeaderIndex from '../../parts/Header'

import './styles.css'
import {format} from '../../Utils/format'

export default function PersonagensShow() {
	const [personagem, setPersonagem] = useState({})
	const {nome} = useParams()
	const history = useHistory()

	useEffect(() => {
		api.get(`personagens/${nome}`).then(response => {
			setPersonagem(response.data)
		})
	}, [nome])

	async function toShow(nome) {
		history.push(`/AkumaNoMi/${nome}`)
	  }

	let grupo = '',
		tripulacao = '',
		posicao = '',
		fruta = '',
		recompensa = '',
		alcunha = '',
		altura = '',
		nasceu = ''

	if(personagem.grupo) (
		grupo = <p><strong>Grupo:</strong> {personagem.grupo}</p>
	)
	if(personagem.tripulacao) (
		tripulacao = <p><strong>Tripulação:</strong> {personagem.tripulacao}</p>
	)

	if(personagem.posicao) (
		posicao = <p><strong>Cargo:</strong> {personagem.posicao}</p>
	)

	if(personagem.frutas) (
		fruta = (
			<div>
				<p><strong>Akuma no mi:</strong></p>
				{personagem.frutas.map(fruta => (
					<p className="nomeFruta" key={fruta.id} onClick={()=> toShow(fruta.nome)}>{fruta.nome}</p>
				))}
			</div>
			
		)
	)

	if(personagem.recompensas) (
		recompensa = (
			<div className="divRecompensas">
				<p><strong>Recompensa Atual:</strong> {format(personagem.recompensas[0].valor)}</p>
				<p><strong>Cartazes de Procurado:</strong></p>
				<div className="recompensasShow">
				{personagem.recompensas.map(recompensa => (
					<img className="imgRecompensa" key={recompensa.id} src={recompensa.path} alt="Imagem de Recompensa" />
				))}
				</div>
			</div>
		)
	)
	
	if(personagem.alcunha) (
		alcunha = <p><strong>Alcunha:</strong> {personagem.alcunha}</p>
	)

	if(personagem.altura) (
		altura = <p><strong>Altura:</strong> {personagem.altura}</p>
	)
	
	if(personagem.nasceu) (
		nasceu = <p><strong>Nasceu:</strong> {personagem.nasceu}</p>
	)

	if(personagem.grupo) (
		grupo = <p><strong>Grupo:</strong> {personagem.grupo}</p>
	)
			
	return (
			<section className="total">
				<HeaderIndex />
				<div className="infos">
					<div className="cabecalho">
						<h1>{personagem.nome}</h1>
						<img src={personagem.path} alt={personagem.nome}/>
					</div>
					{grupo}
					{tripulacao}
					{posicao}
					{fruta}
					{alcunha}
					{altura}
					{nasceu}
					<p><strong>Status: </strong>{personagem.status}</p>
					<p><strong>Sobre: </strong>{personagem.descricao}</p>
					{recompensa}
				</div>
			</section>
		)
}