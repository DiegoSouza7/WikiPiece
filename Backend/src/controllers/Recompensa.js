const db = require('../config/db')
const deleteFile = require('../models/FileDelete')

module.exports = {
  async post(req, res) {
    try {
      let { valor, personagem_id, evento, imagem_id } = req.body

      const [id] = await db('recompensas').insert({
        valor,
        personagem_id,
        evento,
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
      const { valor, personagem_id, evento, imagem_id } = req.body

      if (personagem_id === '' || personagem_id === undefined) {
        const [recompensa] = await db('recompensas').update({
          valor, evento, imagem_id
        }).where('id', id).returning('*')

        return res.json({ recompensa })
      } else {
        const [recompensa] = await db('recompensas').update({
          valor, personagem_id, evento, imagem_id
        }).where('id', id).returning('*')

        return res.json({ recompensa })
      }
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    try {
      const id = req.params.id

      const [recompensa] = await db('recompensas').select('*').where('id', id)

      if (!recompensa) {
        return res.status(401).send()
      }

      await db('recompensas').where('id', id).delete()

      await deleteFile.delete(recompensa.imagem_id)

      return res.status(204).send()
    } catch (error) {
      console.error(error)
    }
  },
  async show(req, res) {
    try {
      const id = req.params.id

      const [recompensa] = await db('recompensas')
        .select('recompensas.*', 'imagens.path')
        .join('imagens', 'imagens.id', 'recompensas.imagem_id')
        .where('recompensas.id', id)

      return res.json(recompensa)
    } catch (error) {
      console.error(error)
    }
  }
}