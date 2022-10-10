const crypto = require('crypto')
const algorithm = 'aes-256-cbc'

const decriptInput = (encriptInput) => {
    const iv = crypto.randomBytes(16)
    const key = crypto.randomBytes(32);

	let encryptedText = Buffer.from(encriptInput, 'hex')
	let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
	let decrypted = decipher.update(encryptedText)
	decrypted = Buffer.concat([decrypted, decipher.final()])
	return decrypted.toString('utf-8')
}


module.exports = {decriptInput}