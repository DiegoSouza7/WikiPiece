import React, { useRef, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import HeaderIndex from '../../parts/Header'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import Input from '../../components/Input'
import ImageInput from '../../components/ImageInput'
import SelectOptions from '../../components/Select'
import Textarea from '../../components/Textarea'
import api from '../../../services/api'
import { AiFillFileImage } from 'react-icons/ai'
import './styles.css'

export default function Index () {
	let [frutas, setFrutas] = useState([])
	let [tripulacoes, setTripulacoes] = useState([])
	let [personagem, setPersonagem] = useState([])
	const history = useHistory()
	const formRef = useRef(null)
	const {nome} = useParams()
	const Authorization = localStorage.getItem('Authorization')

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
			api.get(`adm/frutas`, {
				headers: {
					Authorization
				}
			}).then(response => {
				setFrutas(response.data)
			})
	
			api.get(`adm/tripulacao`, {
				headers: {
					Authorization
				}
			}).then(response => {
				setTripulacoes(response.data)
			})
	
			api.get(`adm/personagem/${nome}`, {
				headers: {
					Authorization
				}
			}).then(response => {
				setPersonagem(response.data)
			})
		}

		Auth()
		Outhers()
		
	}, [nome, Authorization, history])

	const status = [
		{ value: 'Vivo', label: 'Vivo' },
		{ value: 'Morto', label: 'Morto' },
		{ value: 'Desconhecido', label: 'Desconhecido' },
	]

	const recompensa = [
		{ value: true, label: 'Sim' },
		{ value: false, label: 'Não' },
	]

	let ifRecompensa = '',
		ifNotRecompensa = '',
		ifFruta = '',
		ifNotFruta = '',
		ifTripulacaoAtual = '',
		ifNotTripulacaoAtual = '',
		ifPersonagemTripulacaoAntiga = '',
		ifNotPersonagemTripulacaoAntiga = '',
		ifStatus = '',
		ifNotStatus = ''

	const [valueDefaultTripulacaoAtual] = tripulacoes.filter(tripulacao => tripulacao.value === personagem.tripulacao_atual_id)
	const [valueDefaultStatus] = status.filter(status => status.value === personagem.status)
	const [valueDefaultRecompensa] = recompensa.filter(recompensa => recompensa.value === personagem.possui_recompensa)
	
	if(personagem.frutas) (
		ifFruta = (
			<SelectOptions isMulti name="fruta" defaultValue={personagem.frutas} options={frutas} />
		)
	)

	if(!personagem.frutas) (
		ifNotFruta = (
			<SelectOptions isMulti name="fruta" options={frutas} />
		)
	)

	if(valueDefaultTripulacaoAtual) (
		ifTripulacaoAtual = (
			<SelectOptions name="tripulacao_atual" defaultValue={valueDefaultTripulacaoAtual} options={tripulacoes} />
		)
	)

	if(!valueDefaultTripulacaoAtual) (
		ifNotTripulacaoAtual = (
			<SelectOptions name="tripulacao_atual" options={tripulacoes} />
		)
	)

	if(personagem.tripulacao_antiga) (
		ifPersonagemTripulacaoAntiga = (
			<SelectOptions isMulti name="tripulacoes_anteriores" defaultValue={personagem.tripulacao_antiga} options={tripulacoes} />
		)
	)

	if(!personagem.tripulacao_antiga) (
		ifNotPersonagemTripulacaoAntiga = (
			<SelectOptions isMulti name="tripulacoes_anteriores" options={tripulacoes} />
		)
	)

	if(valueDefaultStatus) (
		ifStatus = (
			<SelectOptions name="status" defaultValue={valueDefaultStatus}  options={status} />
		)
	)

	if(!valueDefaultStatus) (
		ifNotStatus = (
			<SelectOptions name="status" options={status} />
		)
	)

	if(valueDefaultRecompensa) (
		ifRecompensa = (
			<SelectOptions name="possui_recompensa" defaultValue={valueDefaultRecompensa} options={recompensa} />
		)
	)
	if(!valueDefaultRecompensa) (
		ifNotRecompensa = (
			<SelectOptions name="possui_recompensa" defaultValue={{ value: false, label: 'Não' }} options={recompensa} />
		)
	)
	
	async function handleSubmit(data) {
		try {
			const schema = Yup.object().shape({
				nome: Yup.string().required('* O nome é obrigatório'),
				descricao: Yup.string().required('Escreva sobre o personagem')
			})

			await schema.validate(data, {
				abortEarly: false
			})

			if(data.image !== undefined) {
				const formData = new FormData();
					formData.append("image", data.image)
		
					const imagem_id = await api.post('adm/imagem', formData, {
						headers: {
							Authorization
						}
					})
						
					data.imagem_id = imagem_id.data
		
					await api.put(`adm/personagem/${personagem.id}`, data, {
						headers: {
							Authorization
						}
					})

					await api.delete('adm/imagem', {
						headers: {
							imagem_id: personagem.imagem_id,
							Authorization
						}
					})
					
				formRef.current.setErrors({})

				history.push('/adm')

			} else {
				await api.put(`adm/personagem/${personagem.id}`, data, {
					headers: {
						Authorization
					}
				})

				formRef.current.setErrors({})
	
				history.push('/adm')
			}
		} catch(err) {
			if (err instanceof Yup.ValidationError) {
				const errorMessages = {}
				err.inner.forEach(error => {
					errorMessages[error.path] = error.message
				})

				formRef.current.setErrors(errorMessages)
			}
		}
	}
	async function handleDeletePersonagem(id) {
		try {
			await api.delete(`adm/personagem/${id}`, {
				headers: {
					Authorization
				}
			})
			history.push('/adm/personagens')
		} catch (error) {
			console.error(error)
            alert('Esse personagem possui alguma recompensa cadastrada.')
		}
	}

	return (
		<section className="total">
		<HeaderIndex />
		<div className="createPersonagem">
			<Form id="form" ref={formRef} initialData={personagem} onSubmit={handleSubmit}>
				<div>
					<h1>Nome:</h1>
					<Input name="nome" />
					<h1>Imagem:</h1>
					<div className="photo">
						<div className="photo-upload">
							<ImageInput name="image" src={personagem.path} />
							<AiFillFileImage size={30} color="rgb(32, 27, 27)" />
						</div>
					</div>
					<h1>Akuma no mi:</h1>
					{ifFruta} {ifNotFruta}
					<h1>Grupo:</h1>
					<Input name="grupo" />
					<h1>Tripulação Atual:</h1>
					<div>
						{ifTripulacaoAtual} {ifNotTripulacaoAtual}
						<h1>Tripulações antigas</h1>
						{ifPersonagemTripulacaoAntiga} {ifNotPersonagemTripulacaoAntiga}
					</div>
					<h1>Posição:</h1>
					<Input name="posicao" />
				</div>
				<div>
					<h1>Alcunha:</h1>
					<Input name="alcunha" />
					<h1>Altura:</h1>
					<Input name="altura" />
					<h1>Nasceu:</h1>
					<Input name="nasceu" />
					<h1>Status:</h1>
					{ifStatus} {ifNotStatus}
					<h1>Possui recompensa?</h1>
					{ifRecompensa} {ifNotRecompensa}
					<h1>Descrição: </h1>
					<Textarea name="descricao" className="descricao" />
					<div className="buttons">
						<button form="form" type="submit">Salvar</button>
						<button type='button' onClick={() => handleDeletePersonagem(personagem.id)}>Apagar</button>
					</div>
				</div>
			</Form>
		</div>
	</section>
	)
}