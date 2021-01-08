const db = require('../config/db')

module.exports = {
  async fruta(req, res) {
    try {
      let arrayFruta = await db('frutas')
        .select('frutas.*')

      let frutas = []
      let nova = {}

      arrayFruta.map(fruta => {
        const { id, nome } = fruta

        nova = {
          value: id,
          label: nome
        }

        return frutas.push(nova)
      })

      return res.json(frutas)
    } catch (error) {
      console.error(error)
    }
  },
  async tripulacao(req, res) {
    try {
      let arrayTripulacao = await db('tripulacao')
        .select('tripulacao.*')

      let tripulacoes = []
      let novo = {}

      arrayTripulacao.map(tripulacao => {
        const { id, nome } = tripulacao

        novo = {
          value: id,
          label: nome
        }

        return tripulacoes.push(novo)
      })
      tripulacoes.push({ value: '', label: 'Não possui tripulação' })

      return res.json(tripulacoes)
    } catch (error) {
      console.error(error)
    }
  },
  async personagem(req, res) {
    try {
      let arrayPersonagem = await db('personagens')
        .select('*').where('possui_recompensa', true)

      let personagem = []
      let novo = {}

      arrayPersonagem.map(perso => {
        const { id, nome } = perso

        novo = {
          label: nome,
          value: id
        }

        return personagem.push(novo)
      })

      return res.json(personagem)
    } catch (error) {
      console.error(error)
    }
  }
}