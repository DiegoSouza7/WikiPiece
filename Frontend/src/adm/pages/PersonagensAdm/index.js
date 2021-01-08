import React, { useEffect } from 'react'
import api from '../../../services/api'
import { useHistory } from 'react-router-dom'
import HeaderIndex from '../../parts/Header'
import Personagens from '../../parts/Personagens'

import './styles.css'

export default function Index() {
  const history = useHistory()
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

    Auth()
  }, [history, Authorization])
  return (
    <section className="total">
      <HeaderIndex />
      <Personagens />
    </section>
  )
}