const db = require('../config/db')
const deleteFile = require('../models/FileDelete')

module.exports = {
    async post(req, res) {
        try {
            const { nome, tipo, descricao, imagem_id } = req.body

            const [id] = await db('frutas').insert({
                nome,
                tipo,
                descricao,
                imagem_id
            }).returning('id')
            
            return res.json({id})
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            const id = req.params.id
            const { nome, tipo, descricao, imagem_id } = req.body
            
            const [fruta] = await db('frutas').update({
                nome,
                tipo,
                descricao,
                imagem_id
            }).where('id', id).returning('*')
    
            return res.json({fruta})
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        try {
            const id = req.params.id

            const personagens_frutas = await db('personagens_frutas').select('*').where('fruta_id', id)
    
            const [fruta] = await db('frutas').select('*').where('id', id)
    
            if(personagens_frutas[0] || !fruta) {
                return res.status(401).send()
            }
    
            await db('frutas').where('id', id).delete()
    
            await deleteFile.delete(fruta.imagem_id)
    
            return res.status(204).send()
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        try {
            const nome = req.params.nome

            let [fruta] = await db('frutas')
                .join('imagens', 'frutas.imagem_id', 'imagens.id')
                .select('frutas.*', 'imagens.path')
                .where('frutas.nome', nome)
    
            const usuarios = await db('personagens_frutas')
                .select('personagens.nome', 'imagens.path')
                .join('personagens', 'personagens.id', 'personagens_frutas.personagem_id')
                .join('imagens', 'personagens.imagem_id', 'imagens.id')
                .where('personagens_frutas.fruta_id', fruta.id)
    
            if(usuarios[0]) fruta.usuarios = usuarios
    
            return res.json(fruta)
        } catch (error) {
            console.error(error)
        }
    }
}