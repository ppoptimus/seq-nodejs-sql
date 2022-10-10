const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const fs = require('fs')

const encryptInput = (plainText) => {
	const iv = crypto.randomBytes(16)
	const key = Buffer.from(secretKey(),'base64') 
	console.log('secret key = ', secretKey())

	let cipher = crypto.createCipheriv(algorithm, key, iv)
	let encrypted = cipher.update(plainText)
	encrypted = Buffer.concat([encrypted, cipher.final()])

	console.log('input= ', encrypted.toString('hex'))
	return encrypted.toString('hex')
}

const encryptSecret = () => {
	const publicKey = Buffer.from(fs.readFileSync('public/public.pem', { encoding: 'utf-8' }))

	const encryptedData = crypto.publicEncrypt(
		{
		  key: publicKey,
		  padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		  oaepHash: 'sha256',
		},
		
		Buffer.from(secretKey())
	  )
	  console.log('encryptSecret= ',encryptedData.toString('base64'))
}

const secretKey = () =>{
	const key = crypto.randomBytes(32);
	return key.toString('base64')
}

module.exports = {encryptInput, encryptSecret}
