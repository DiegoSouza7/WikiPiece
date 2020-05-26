import React, { useRef, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import HeaderIndex from '../../parts/Header'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import Input from '../../components/Input'
import ImageInput from '../../components/ImageInput'
import Textarea from '../../components/Textarea'
import SelectOptions from '../../components/Select'
import api from '../../../services/api'
import { AiFillFileImage } from 'react-icons/ai'
import './styles.css'

export default function Index() {
	let [frutas, setFrutas] = useState({})
	let [tripulacoes, setTripulacoes] = useState({})
	const history = useHistory()
	const formRef = useRef(null)
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
		}

		Auth()
		Outhers()

	}, [Authorization, history])

	const status = [
		{ value: 'Vivo', label: 'Vivo' },
		{ value: 'Morto', label: 'Morto' },
	]

	const recompensa = [
		{ value: true, label: 'Sim' },
		{ value: false, label: 'Não' },
	]

	async function handleSubmit(data) {
		try {
			const schema = Yup.object().shape({
				nome: Yup.string().required('* O nome é obrigatório'),
				image: Yup.mixed().required('Envie uma imagem'),
				descricao: Yup.string().required('Escreva sobre o personagem'),
			})

			await schema.validate(data, {
				abortEarly: false
			})
			
			const formData = new FormData();
				formData.append("image", data.image)
			
			let imagem_id = await api.post('adm/imagem', formData, {
				headers: {
					Authorization
				}
			})

			imagem_id = imagem_id.data

			const { nome, grupo, fruta, posicao, alcunha, altura, tripulacao_atual,
                tripulacoes_anteriores, nasceu, possui_recompensa, descricao,
                status } = data

			await api.post('adm/personagem', 
				{nome, grupo, fruta, posicao, alcunha, altura, tripulacao_atual,
				tripulacoes_anteriores, nasceu, possui_recompensa, descricao, status, 
				imagem_id}, 
				{
				headers: {
					Authorization
				}
			})

			formRef.current.setErrors({})

			history.push('/adm')
		} catch(err) {
			console.error(err)
			if (err instanceof Yup.ValidationError) {
				const errorMessages = {}
				err.inner.forEach(error => {
					errorMessages[error.path] = error.message
				})

				formRef.current.setErrors(errorMessages)
			}
		}
	}

	return (
		<section className="total">
			<HeaderIndex />
			<div className="createPersonagem">
				<Form ref={formRef} onSubmit={handleSubmit}>
					<div>
					<h1>Nome:</h1>
					<Input name="nome" />
					<h1>Imagem:</h1>
					<div className="photo">
						<div className="photo-upload">
							<ImageInput name="image" />
							<AiFillFileImage size={30} color="rgb(32, 27, 27)" />
						</div>
					</div>
					<h1>Akuma no mi:</h1>
					<SelectOptions isMulti name="fruta" options={frutas} />
					<h1>Grupo:</h1>
					<Input name="grupo" />
					<h1>Tripulação Atual:</h1>
					<div>
						<SelectOptions name="tripulacao_atual" options={tripulacoes} />
						<h1>Tripulações antigas</h1>
						<SelectOptions isMulti name="tripulacoes_anteriores" options={tripulacoes} />
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
					<h1>Staus:</h1>
					<SelectOptions name="status" options={status} />
					<h1>Possui recompensa?</h1>
					<SelectOptions name="possui_recompensa" options={recompensa} />
					<h1>Descrição: </h1>
					<Textarea name="descricao" className="descricao" />
					<button type="submit">Salvar</button>
					</div>
				</Form>
			</div>
		</section>
	)
}