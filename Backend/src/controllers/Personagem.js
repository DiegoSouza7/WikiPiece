const db = require('../config/db')
const deleteFile = require('../models/FileDelete')

module.exports = {
    async post(req, res) {
        try {
            let { nome, grupo, fruta, posicao, alcunha, altura, tripulacao_atual,
                tripulacoes_anteriores, nasceu, possui_recompensa, descricao,
                status, imagem_id
            } = req.body
    
            tripulacoes_anteriores = tripulacoes_anteriores.filter(id => id !== '')
            fruta = fruta.filter(fruta => fruta !== '')
            if (possui_recompensa == '') possui_recompensa = false
    
            const [id] = await db('personagens').insert({
                nome, grupo, posicao, alcunha,
                altura, nasceu, possui_recompensa,
                descricao, status, imagem_id
            }).returning('id')
    
            if (tripulacao_atual) await db('personagens_tripulacao').insert({
                personagem_id: id,
                tripulacao_id: tripulacao_atual,
                tripulacao_atual: true
            }).returning('id')
    
            if (fruta) for (fruta of fruta) {
                await db('personagens_frutas')
                    .insert({
                        personagem_id: id,
                        fruta_id: fruta
                    }).returning('id')
            }
    
            if (tripulacoes_anteriores) for(tripulacao of tripulacoes_anteriores) {
                await db('personagens_tripulacao').insert({
                    personagem_id: id,
                    tripulacao_id: tripulacao
                }).returning('id')
            }
    
            return res.json({id})
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            let { nome, grupo, fruta, posicao, alcunha, altura, tripulacao_atual,
                tripulacoes_anteriores, nasceu, possui_recompensa, descricao,
                status, imagem_id } = req.body
            
            tripulacoes_anteriores = tripulacoes_anteriores.filter(id => id !== '')
            
            const id = req.params.id
            
            const [personagem] = await db('personagens').update({
                nome, grupo, posicao, alcunha,
                altura, nasceu, possui_recompensa,
                descricao, status, imagem_id
            }).where('id', id).returning('*')
            
            // tripulação atual
            
            const [verificaTripulacaoAtual] = await db('personagens_tripulacao')
            .select('*').where('personagem_id', id).where('tripulacao_atual', true)
            
            if((tripulacao_atual !== '') && !verificaTripulacaoAtual) await db('personagens_tripulacao').insert({
                personagem_id: id,
                tripulacao_id: tripulacao_atual,
                tripulacao_atual: true
            }).returning('id')
            
            if((tripulacao_atual !== '') && verificaTripulacaoAtual && (verificaTripulacaoAtual.tripulacao_id !== tripulacao_atual)) await db('personagens_tripulacao').update({
                personagem_id: id,
                tripulacao_id: tripulacao_atual,
                tripulacao_atual: true
            }).where('id', verificaTripulacaoAtual.id).returning('id')
            
            if((tripulacao_atual == '') && verificaTripulacaoAtual) await db('personagens_tripulacao').delete().where('id', verificaTripulacaoAtual.id)
            
            // tripulação antigas
            
            const verificaTripulacaoAnterior = await db('personagens_tripulacao')
            .select('*').where('personagem_id', id).where('tripulacao_atual', false)
            
            if(tripulacoes_anteriores[0]) for (tripulacoes_anterior of tripulacoes_anteriores) {
                if(!verificaTripulacaoAnterior[0]) await db('personagens_tripulacao').insert({
                    personagem_id: id,
                    tripulacao_id: tripulacoes_anterior,
                    tripulacao_atual: false
                }).returning('id')
                
                const verificaSeExisteCadastro = verificaTripulacaoAnterior.filter(verefica => verefica.tripulacao_id === tripulacoes_anterior)
                if(verificaTripulacaoAnterior[0] && !verificaSeExisteCadastro[0]) await db('personagens_tripulacao').insert({
                    personagem_id: id,
                    tripulacao_id: tripulacoes_anterior,
                    tripulacao_atual: false
                }).returning('id')
            }
            
            for(verificaTripulacaoAnteriorParaDelete of verificaTripulacaoAnterior) {
                const [verificaSeExisteCadastro] = tripulacoes_anteriores.filter(tripulacao => tripulacao === verificaTripulacaoAnteriorParaDelete.tripulacao_id)
                if(!verificaSeExisteCadastro) await db('personagens_tripulacao').delete().where('id', verificaTripulacaoAnteriorParaDelete.id)
            }
            
            //frutas
            
            const verificaFrutas = await db('personagens_frutas')
            .select('*').where('personagem_id', id)
            
    
            if(fruta[0]) for(frut of fruta) {
                if(!verificaFrutas[0]) await db('personagens_frutas').insert({
                    personagem_id: id,
                    fruta_id: frut
                }).returning('id')
                
                const verificaSeExisteCadastroFruta = verificaFrutas.filter(verifica => verifica.fruta_id === frut)
                if(verificaFrutas[0] && !verificaSeExisteCadastroFruta[0]) await db('personagens_frutas').insert({
                    personagem_id: id,
                    fruta_id: frut
                }).returning('id')
            }
    
            for(verificaFrutasParaDelete of verificaFrutas) {
                const [verificaSeExisteCadastroFruta] = fruta.filter(fruta => fruta === verificaFrutasParaDelete.fruta_id)
                if(!verificaSeExisteCadastroFruta) await db('personagens_frutas').delete().where('id', verificaFrutasParaDelete.id)
            }
    
            return res.json({ personagem })
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        try {
            const id = req.params.id

            const [personagem] = await db('personagens').select('*').where('id', id)
    
            const recompensas = await db('recompensas').select('*').where('personagem_id', id)

            if (!personagem || recompensas[0]) {
                return res.status(401).send()
            }

            const personagem_fruta = await db('personagens_frutas').select('*').where('personagem_id', id)
            const personagem_tripulacao = await db('personagens_tripulacao').select('*').where('personagem_id', id)
            
            if(personagem_fruta[0]) await db('personagens_frutas').delete().where('personagem_id', id)
            if(personagem_tripulacao[0]) await db('personagens_tripulacao').delete().where('personagem_id', id)

            await db('personagens').where('id', id).delete()
            
            await deleteFile.delete(personagem.imagem_id)
    
            return res.status(204).send()
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        try {
            const nome = req.params.nome

            let personagem = await db('personagens')
                .select('personagens.*', 'imagens.path')
                .join('imagens', 'personagens.imagem_id', 'imagens.id')
                .where('personagens.nome', nome)
    
            if (!personagem[0]) {
                return res.status(401).send()
            }
    
            personagem = personagem[0]
    
            const [tripulacao] = await db('personagens_tripulacao')
                .select('tripulacao.nome', 'personagens_tripulacao.tripulacao_id')
                .join('tripulacao', 'tripulacao.id', 'personagens_tripulacao.tripulacao_id')
                .where('personagens_tripulacao.personagem_id', personagem.id)
                .where('personagens_tripulacao.tripulacao_atual', true)

            if (tripulacao) personagem.tripulacao = tripulacao.nome
    
            const fruta = await db('personagens_frutas')
                .select('frutas.nome', 'frutas.id')
                .join('frutas', 'frutas.id', 'personagens_frutas.fruta_id')
                .where('personagens_frutas.personagem_id', personagem.id)
    
            if (fruta[0]) personagem.frutas = fruta
    
            const recompensas = await db('recompensas')
                .select('recompensas.id', 'recompensas.valor', 'recompensas.evento', 'imagens.path')
                .join('imagens', 'recompensas.imagem_id', 'imagens.id')
                .where('recompensas.personagem_id', personagem.id)
                .orderBy('recompensas.valor', 'desc')
    
            if (recompensas.length >= 1) personagem.recompensas = recompensas
    
            return res.json(personagem)
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            const nome = req.params.nome

            let personagem = await db('personagens')
                .select('personagens.*', 'imagens.path')
                .join('imagens', 'personagens.imagem_id', 'imagens.id')
                .where('personagens.nome', nome)
    
            if (!personagem[0]) {
                return res.status(401).send()
            }
    
            personagem = personagem[0]
    
            const [tripulacao] = await db('personagens_tripulacao')
                .select('tripulacao.nome', 'personagens_tripulacao.tripulacao_id')
                .join('tripulacao', 'tripulacao.id', 'personagens_tripulacao.tripulacao_id')
                .where('personagens_tripulacao.personagem_id', personagem.id)
                .where('personagens_tripulacao.tripulacao_atual', true)

            if (tripulacao) personagem.tripulacao = tripulacao.nome
            if (tripulacao) personagem.tripulacao_atual_id = tripulacao.tripulacao_id

            const tripulacao_antiga = await db('personagens_tripulacao')
            .select(function () {
                this.select('tripulacao.nome').as('label')
            }, function () {
                this.select('tripulacao_id').as('value')
            })
            .join('tripulacao', 'tripulacao.id', 'personagens_tripulacao.tripulacao_id')
            .where('personagens_tripulacao.personagem_id', personagem.id)
            .where('personagens_tripulacao.tripulacao_atual', false)

            if(tripulacao_antiga) personagem.tripulacao_antiga = tripulacao_antiga
    
            const fruta = await db('personagens_frutas')
                .select(function () {
                    this.select('frutas.nome').as('label')
                }, function () {
                    this.select('frutas.id').as('value')
                })
                .join('frutas', 'frutas.id', 'personagens_frutas.fruta_id')
                .where('personagens_frutas.personagem_id', personagem.id)
    
            if (fruta[0]) personagem.frutas = fruta
    
            const recompensas = await db('recompensas')
                .select('recompensas.id', 'recompensas.valor', 'recompensas.evento', 'imagens.path')
                .join('imagens', 'recompensas.imagem_id', 'imagens.id')
                .where('recompensas.personagem_id', personagem.id)
                .orderBy('recompensas.valor', 'desc')
    
            if (recompensas.length >= 1) personagem.recompensas = recompensas
    
            return res.json(personagem)
        } catch (error) {
            console.error(error)
        }
    }
}