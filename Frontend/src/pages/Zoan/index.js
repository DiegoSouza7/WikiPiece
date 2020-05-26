import React from 'react'

import HeaderIndex from '../../parts/Header'
import AkumasNoMi from '../../parts/AkumasNoMi'

import './styles.css'

export default function Index() {
	return (
		<section className="total">
			<HeaderIndex />
			<AkumasNoMi grupo="Zoan"/>
		</section>
	)
}