const db = require('../config/db')
const { hash, compare } = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../config/mailer')

module.exports = {
	async login(req, res) {
		try {
			const { email, password } = req.body
			const user = await db('users')
				.select('*')
				.where('email', email).first()

			if (!user) {
				return res.status(401).json({ error: 'Error' })
			}

			const passed = await compare(password, user.password)
			if (passed === false) return res.json('Senha incorreta')

			const token = jwt.sign({
				id: user.id
			}, process.env.JWT_KEY, {
				expiresIn: 60 * 60
			})

			return res.json(token)
		} catch (error) {
			return res.status(401).send()
		}
	},
	async forgot(req, res) {
		try {
			const { email } = req.body

			const user = await db('users')
				.select('*')
				.where('email', email).first()

			if (!user) {
				return res.status(401).json({ error: 'Error' })
			}

			const reset_token = crypto.randomBytes(20).toString('hex')

			let now = new Date()
			now = now.setHours(now.getHours() + 1)
			const reset_token_expires = now

			await db('users').update({
				reset_token,
				reset_token_expires
			}).where('id', user.id)

			await mailer.sendMail({
				to: user.email,
				from: 'no-reply@newProjet.com',
				subject: 'Recuperação de senha',
				html: `<h2>Perdeu a senha?</h2>
                <p>Clique no link para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/passwordReset?token=${reset_token}" target="_blanck">
                    CRIAR SENHA
                    </a>
                </p>
                `
			})

			return res.status(200).json("Verifique seu email para resetar sua senha!")

		} catch (error) {
			return res.status(401).send()
		}
	},
	async reset(req, res) {
		let { email, password, location } = req.body
		let reset_token = location.replace('token=', '')

		try {
			const user = await db('users')
				.select('*')
				.where('email', email).first()

			if (reset_token !== user.reset_token) return res.status(401).send()

			let now = new Date()

			now = now.setHours(now.getHours())

			if (now > user.reset_token_expires) return res.status(401).send()

			password = await hash(password, 8)

			await db('users').update({
				password,
				reset_token: '',
				reset_token_expires: ''
			}).where('id', user.id)

			return res.status(200).send()
		} catch (error) {
			return res.status(401).send()
		}

	}
}