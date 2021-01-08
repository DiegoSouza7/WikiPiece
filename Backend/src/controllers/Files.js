const db = require('../config/db')
const deleteFile = require('../models/FileDelete')

module.exports = {
  async post(req, res) {
    try {
      const [id] = await db('imagens').insert({
        nome: req.file.key || req.file.filename,
        path: req.file.location || `${process.env.APP_URL}/files/${req.file.filename}`
      }).returning('id')
      return res.json(id)
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    try {
      const id = req.headers.imagem_id

      await deleteFile.delete(id)

      return res.status(204).send()
    } catch (error) {
      console.error(error)
    }
  }
}