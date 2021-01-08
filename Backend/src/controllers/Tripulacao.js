const db = require('../config/db')
const deleteFile = require('../models/FileDelete')

module.exports = {
  async post(req, res) {
    try {
      const { nome, numero_membros, recompensa_total, descricao, imagem_id } = req.body

      const [id] = await db('tripulacao').insert({
        nome,
        numero_membros,
        recompensa_total,
        descricao,
        imagem_id
      }).returning('id')

      return res.json({ id })
    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {
      const id = req.params.id

      const { nome, numero_membros, recompensa_total, descricao, imagem_id } = req.body

      const [tripulacao] = await db('tripulacao').update({
        nome, numero_membros, recompensa_total, descricao, imagem_id
      }).where('id', id).returning('*')

      return res.json({ tripulacao })
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id

      const [tripulacao] = await db('tripulacao').select('*').where('id', id)

      const personagens_tripulacao = await db('personagens_tripulacao').select('*').where('tripulacao_id', id)


      if (personagens_tripulacao[0] || !tripulacao) {
        return res.status(401).send()
      }

      await db('tripulacao').where('id', id).delete()

      await deleteFile.delete(tripulacao.imagem_id)

      return res.status(204).send()
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {
      const nome = req.params.nome

      let [tripulacao] = await db('tripulacao')
        .select('tripulacao.*', 'imagens.path')
        .join('imagens', 'tripulacao.imagem_id', 'imagens.id')
        .where('tripulacao.nome', nome)

      if (!tripulacao) return res.status(401).send()

      const membrosAtuaisConhecidos = await db('personagens_tripulacao')
        .select('personagens.nome', 'imagens.path')
        .join('personagens', 'personagens.id', 'personagens_tripulacao.personagem_id')
        .join('imagens', 'personagens.imagem_id', 'imagens.id')
        .where('personagens_tripulacao.tripulacao_id', tripulacao.id)
        .where('personagens_tripulacao.tripulacao_atual', true)

      if (membrosAtuaisConhecidos[0]) tripulacao.membrosAtuaisConhecidos = membrosAtuaisConhecidos

      const antigosMembros = await db('personagens_tripulacao')
        .select('personagens.nome', 'imagens.path')
        .join('personagens', 'personagens.id', 'personagens_tripulacao.personagem_id')
        .join('imagens', 'personagens.imagem_id', 'imagens.id')
        .where('personagens_tripulacao.tripulacao_id', tripulacao.id)
        .where('personagens_tripulacao.tripulacao_atual', false)

      if (antigosMembros[0]) tripulacao.antigosMembros = antigosMembros

      return res.json(tripulacao)
    } catch (error) {
      console.error(error)
    }
  }
}