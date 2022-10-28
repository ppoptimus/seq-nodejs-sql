const crypto = require('crypto')
const fs = require('fs')
const algorithm = 'aes-256-cbc'

const decryptBody = (req, res) => {
	//  const input = decriptInput(req.body.input);
	const secret = decryptSecret(req.body.secret)

	let AESCrypt = {}
	AESCrypt.decrypt = function (cryptkey, iv, encryptdata) {
		var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv)
		return Buffer.concat([decipher.update(encryptdata), decipher.final()])
	}
	let encrypt1 = Buffer.from(req.body.input,'base64')
	let iv = crypto.randomBytes(16)
	
	let dec = AESCrypt.decrypt(secret, iv, encrypt1);
	// console.warn('decrypt all: ' + dec.toString('utf8'))
}

const decryptSecret = (secret) => {
	const privateKey = fs.readFileSync('public/private.pem', {
		encoding: 'utf-8',
	}) //ดึง privateKey จากไฟล์ private.pem//
	const buffer = Buffer.from(secret, 'base64') //Buffer privateKey จากไฟล์ private.pem//

	const decryptedSecret = crypto.privateDecrypt(
		//นำ req.body.secret มา decript ด้วย privateKey แล้วเก็บไว้ที่ตัวแปร decryptedData//
		{
			key: privateKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: 'sha256',
		},
		Buffer.from(secret, 'base64')
	) //จะได้ secret เพื่อไปถอดรหัส req.body.input อีกทีนึงด้วย AES Algorithm//
	return decryptedSecret
}

const decriptInput = (encriptInput, secret) => {
	let input
	const iv = crypto.randomBytes(16)
	const key = Buffer.from(secret, 'base64')

	let encryptedText = Buffer.from(encriptInput, 'base64')
	console.log('encryptedText = ', encryptedText)

	let decipher = crypto.createDecipheriv(algorithm, key, iv)
	console.log('decipher = ', decipher)

	// let decrypted = decipher.update(encryptedText)
	// console.log("decrypted = ", decrypted)

	// decrypted = Buffer.concat([decrypted, decipher.final()])
	// input = decrypted.toString('utf-8')
	return input
}

const secretKey = () => {
	const key = crypto.randomBytes(32)
	return key.toString('base64')
}

module.exports = decryptBody
