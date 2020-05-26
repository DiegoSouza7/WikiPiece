import React from 'react'

import HeaderIndex from '../../parts/Header'
import Personagens from '../../parts/Personagens'

import './styles.css'

export default function Piratas() {
	return (
		<section className="total">
			<HeaderIndex />
			<Personagens grupo="Pirata" />
		</section>
	)
}