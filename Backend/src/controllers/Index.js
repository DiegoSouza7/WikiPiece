const db = require('../config/db')

module.exports = {
    async index(req, res) {
        try {
            const limit = req.headers.limit
            const offset = req.headers.offset
            const grupo = req.headers.grupo
    
            let personagens = []
    
            if(grupo && (grupo !== 'todos') && (grupo !== 'Outros')) personagens = await db
                .select('personagens.*', 'imagens.path', function () {
                    this.count('*').from('personagens').where('personagens.grupo', grupo).as('total')
                }).from('personagens')
                .join('imagens', 'personagens.imagem_id', 'imagens.id')
                .limit(limit).offset(offset)
                .where('personagens.grupo', grupo)
    
    
            if(grupo == 'todos') personagens = await db
                .select('personagens.*', 'imagens.path', function () {
                    this.count('*').from('personagens').as('total')
                }).from('personagens')
                .join('imagens', 'personagens.imagem_id', 'imagens.id')
                .limit(limit).offset(offset)

            if(grupo == 'Outros') personagens = await db
            .select('personagens.*', 'imagens.path', function () {
                this.count('*').from('personagens').where('personagens.grupo', grupo).as('total')
            }).from('personagens')
            .join('imagens', 'personagens.imagem_id', 'imagens.id')
            .limit(limit).offset(offset)
            .where('personagens.grupo', '!=', 'Pirata')
            .where('personagens.grupo', '!=', 'Revolucionário')
            .where('personagens.grupo', '!=', 'Marinheiro')
            .where('personagens.grupo', '!=', 'Governo Mundial')
            
            if(!personagens || !personagens[0]) return res.status(401).send()
    
            return res.json(personagens)
        } catch (error) {
            console.error(error)
        }
    },
    async fruta(req, res) {
        try {
            const limit = req.headers.limit
            const offset = req.headers.offset
            const grupo = req.headers.grupo
    
            let frutas = []
    
            if(grupo && (grupo !== 'todos')) frutas = await db.select('frutas.*', 'imagens.path', function () {
                this.count('*').from('frutas').where('frutas.tipo', grupo).as('total')
            }).from('frutas')
            .join('imagens', 'frutas.imagem_id', 'imagens.id')
            .where('frutas.tipo', grupo)
            .limit(limit).offset(offset)
    
            if(grupo == 'todos') frutas = await db.select('frutas.*', 'imagens.path', function () {
                this.count('*').from('frutas').as('total')
            }).from('frutas')
            .join('imagens', 'frutas.imagem_id', 'imagens.id')
            .limit(limit).offset(offset)
    
            if(!frutas || !frutas[0]) return res.status(401).send()
    
            return res.json(frutas)
        } catch (error) {
            console.error(error)
        }
    },
    async recompensa(req, res) {
        try {
            const limit = req.headers.limit
            const offset = req.headers.offset
    
            const pushTotal = await db.select('recompensas.*', 'imagens.path')
            .from(function () {
                this.select('personagem_id').max('valor').from('recompensas')
                .groupBy('personagem_id').as('d')
            }).join('recompensas', function() {
                this.on('recompensas.personagem_id', '=', 'd.personagem_id').andOn('recompensas.valor', '=', 'd.max')
            }).join('imagens', 'imagens.id', 'recompensas.imagem_id')
            .orderBy('recompensas.valor', 'desc')
    
            if(!pushTotal || !pushTotal[0]) return res.status(401).send()
    
            let recompensas = await db.select('recompensas.*', 'imagens.path', 'personagens.nome', 'personagens.status', 'personagens.grupo')
            .from(function () {
                this.select('personagem_id').max('valor').from('recompensas')
                .groupBy('personagem_id').as('d')
            }).join('recompensas', function() {
                this.on('recompensas.personagem_id', '=', 'd.personagem_id').andOn('recompensas.valor', '=', 'd.max')
            }).join('imagens', 'imagens.id', 'recompensas.imagem_id')
            .join('personagens', 'personagens.id', 'recompensas.personagem_id')
            .orderBy('recompensas.valor', 'desc')
            .limit(limit).offset(offset)
    
            const total = pushTotal.length
    
            if(!recompensas || !recompensas[0]) return res.status(401).send()

            let modificaRecompensas = []
            recompensas.map(recompensa => {
                recompensa.total = total
                
                const personagem = {
                    nome: recompensa.nome,
                    grupo: recompensa.grupo,
                    status: recompensa.status
                }
                
                recompensa.personagem = personagem

                recompensaNewFormt = {
                    id: recompensa.id,
                    valor: recompensa.valor,
                    personagem_id: recompensa.personagem_id,
                    evento: recompensa.evento,
                    path: recompensa.path,
                    total: recompensa.total,
                    personagem: recompensa.personagem
                }

                return modificaRecompensas.push(recompensaNewFormt)
            })

            recompensas = modificaRecompensas
    
            return res.json(recompensas)
        } catch (error) {
            console.error(error)
        }
    },
    async recompensasAdm(req, res) {
        try {
            const limit = req.headers.limit
            const offset = req.headers.offset
    
            const recompensas = await db.select('recompensas.*', 'imagens.path', function() {
                this.count('*').from('recompensas').as('total')
            })
            .from('recompensas').join('imagens', 'imagens.id', 'recompensas.imagem_id')
            .orderBy('recompensas.valor', 'desc')
            .limit(limit).offset(offset)
    
    
            if(!recompensas || !recompensas[0]) return res.status(401).send()
    
            return res.json(recompensas)
        } catch (error) {
            console.error(error)
        }
    },
    async tripulacao(req, res) {
        try {
            const limit = req.headers.limit
            const offset = req.headers.offset
    
            let tripulacao = await db.select('tripulacao.*', 'imagens.path', function () {
                this.count('*').from('tripulacao').as('total')
            }).from('tripulacao')
            .join('imagens', 'tripulacao.imagem_id', 'imagens.id')
            .limit(limit).offset(offset)
    
            
            if(!tripulacao || !tripulacao[0]) return res.status(401).send()
    
            return res.json(tripulacao)
        } catch (error) {
            console.error(error)
        }
    },
    async search(req, res) {
        try {
            const filter = req.headers.location
            let results = {}
    
            const personagem = await db('personagens')
                .select('personagens.*', 'imagens.path')
                .join('imagens', 'personagens.imagem_id', 'imagens.id')
                .where('personagens.nome', 'ilike', `%${filter}%`)
    
            if(personagem[0]) results.personagens = personagem
    
            const tripulacao = await db('tripulacao')
                .select('tripulacao.*', 'imagens.path')
                .join('imagens', 'tripulacao.imagem_id', 'imagens.id')
                .where('tripulacao.nome', 'ilike', `%${filter}%`)
    
            if(tripulacao[0]) results.tripulacoes = tripulacao
    
            const frutas = await db('frutas')
                .select('frutas.*', 'imagens.path')
                .join('imagens', 'frutas.imagem_id', 'imagens.id')
                .where('frutas.nome', 'ilike', `%${filter}%`)
    
            if(frutas[0]) results.frutas = frutas
    
            return res.json(results)
        } catch (error) {
            console.error(error)
        }
    }
}