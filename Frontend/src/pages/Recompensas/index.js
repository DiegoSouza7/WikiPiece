import React from 'react'

import HeaderIndex from '../../parts/Header'
import Recompensas from '../../parts/Recompensas'

import './styles.css'

export default function Index() {
  return (
    <section className="total">
      <HeaderIndex />
      <Recompensas />
    </section>
  )
}