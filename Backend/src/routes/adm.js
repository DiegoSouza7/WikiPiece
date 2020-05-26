const express = require('express')
const routes = express.Router()
const { celebrate, Joi, Segments } = require('celebrate')
const multer = require('../config/multer')
const Files = require('../controllers/Files')
const Fruta = require('../controllers/Frutas')
const Tripulacao = require('../controllers/Tripulacao')
const Personagem = require('../controllers/Personagem')
const Recompensa = require('../controllers/Recompensa')
const Unique = require('../controllers/Unique')
const Session = require('../controllers/Session')
const jwt = require('../middlewares/jwt')

routes.post('/login', Session.login)
routes.post('/forgotPassword', Session.forgot)
routes.post('/passwordReset', Session.reset)

routes.post('/imagem', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, multer.single('image'), Files.post)
routes.post('/fruta', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Fruta.post)
routes.post('/tripulacao', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Tripulacao.post)
routes.post('/personagem', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt,Personagem.post)
routes.post('/recompensa', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Recompensa.post)

routes.put('/fruta/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Fruta.put)
routes.put('/tripulacao/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Tripulacao.put)
routes.put('/personagem/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Personagem.put)
routes.put('/recompensa/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Recompensa.put)

routes.delete('/imagem', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Files.delete)
routes.delete('/fruta/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Fruta.delete)
routes.delete('/tripulacao/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Tripulacao.delete)
routes.delete('/personagem/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Personagem.delete)
routes.delete('/recompensa/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Recompensa.delete)

// select options for create

routes.get('/frutas', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Unique.fruta)
routes.get('/tripulacao', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Unique.tripulacao)
routes.get('/personagem', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Unique.personagem)
routes.get('/personagem/:nome', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), jwt, Personagem.edit)


module.exports = routes