const db = require('../config/db')
const { unlinkSync } = require('fs')
const aws = require('aws-sdk')
const s3 = new aws.S3()

module.exports = {
    async delete(id) {
        try {
            let [image] = await db('imagens').select('*').where('id', id)
            
            await db.delete().from('imagens').where('imagens.id', image.id)

            if(process.env.STORAGE_TYPE === 's3') {
                return s3.deleteObject({
                    Bucket: 'uploadimagensmy',
                    Key: image.nome
                }).promise()
            }else {
                unlinkSync(image.path.replace(`${process.env.APP_URL}/files`, 'tmp/uploads/'))
            }
        } catch (error) {
            console.error(error)
        }
    }
}