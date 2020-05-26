require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { errors } = require('celebrate')
const routes = require('./routes/')
const path = require('path')

const server = express()
server.use(cors({origin: process.env.ACEPT_CORS}))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use('/files',
 express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

server.use(routes)
server.use(errors())

server.listen(process.env.PORT)