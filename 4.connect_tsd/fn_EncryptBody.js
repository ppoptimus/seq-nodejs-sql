const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const fs = require('fs')

const encryptBody = (req, res) => {
	const secretKey = getSecretKey()
	console.log('secretKey=', secretKey)

	let encryptedInput = encryptInput(JSON.stringify(req.body), secretKey)
	let encryptedSecret = encryptSecret(secretKey)
	let response = res.status(200).json({
		input: encryptedInput,
		secret: encryptedSecret,
	})
	return response
}

const encryptInput = (plainText, secretKey) => {
	var AESCrypt = {}

	AESCrypt.encrypt = function (cryptkey, iv, cleardata) {
		var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv)
		return Buffer.concat([encipher.update(cleardata), encipher.final()])
	}
	AESCrypt.decrypt = function (cryptkey, iv, encryptdata) {
		var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv)
		return Buffer.concat([decipher.update(encryptdata), decipher.final()])
	}

	let cryptkey = crypto.createHash('sha256').update(secretKey).digest()
	let iv = crypto.randomBytes(16)
	let buf = Buffer.from(plainText)

	let enc = AESCrypt.encrypt(cryptkey, iv, buf)
	console.log(cryptkey)
	console.log(enc)

	let dec = AESCrypt.decrypt(cryptkey, iv, enc)

	console.warn('secretKey in Base64:', secretKey)
	console.warn('secretKey in Buffer:', cryptkey)
	console.warn('encrypt in Buffer:', enc)
	console.warn('encrypt in Base64:', enc.toString('base64'))
	// console.warn('decrypt all: ' + dec.toString('utf8'))

	return enc.toString('base64')
}

const encryptSecret = (secretKey) => {
	const publicKey = fs.readFileSync('public/public.pem', { encoding: 'utf-8' })

	const encryptedData = crypto.publicEncrypt(
		{
			key: publicKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: 'sha256',
		},

		Buffer.from(secretKey)
	)
	return encryptedData.toString('base64', { encoding: 'utf-8' })
}

const getSecretKey = () => {
	const key = crypto.randomBytes(16)
	return key.toString('base64')
}

module.exports = encryptBody
