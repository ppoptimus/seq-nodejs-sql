const sql = require('mssql')
const config = require('../dbConfig')
const saveLog = require('../fn_SaveLog')
const crypto = require('crypto')
const fs = require('fs')
const encryption = require('./fn_EncryptBody')
const decryption = require('./fn_DecryptBody')

const tsdGetConnect = (req, res) => {
	const apiKey = req.headers['api-key']
	const input = req.body.input
	const secret = req.body.secret
	const plainText = '{"username":"TSD","password":"Tsd@12345#."}'

	//#region decript secret--------------------------------
	const privateKey = fs.readFileSync('public/private.pem', 'utf8') //ดึง privateKey จากไฟล์ private.pem//
	const buffer = Buffer.from(secret, 'base64') //Buffer privateKey จากไฟล์ private.pem//
	const decryptedSecret = crypto.privateDecrypt(
		//นำ req.body.secret มา decript ด้วย privateKey แล้วเก็บไว้ที่ตัวแปร decryptedData//
		{
			key: privateKey.toString(),
			passphrase: '',
			padding: crypto.constants.RSA_PKCS1_PADDING,
		},
		buffer
	) //จะได้ secret เพื่อไปถอดรหัส req.body.input อีกทีนึงด้วย AES Algorithm//
	//#endregion decript secret-----------------------------

	//#region decript input --------------------------------
	const en = encryption.encryptInput(plainText)
	const enSecret = encryption.encryptSecret()
	// const encrypted = encryption.encryptInput(plainText)
	// const decrypted = decryption.decriptInput(encrypted)
	// console.log(decrypted)

	//#endregion decript input -----------------------------

	let response = {
		responseCode: '',
		responseStatus: '',
		reponseMessage: '',
	}

	sql.connect(config, (err) => {
		if (err) {
			response.responseCode = '909'
			response.responseStatus = 'E'
			response.reponseMessage = 'Failed to connec Database'
		} else {
			if (true) {
				response.responseCode = '000'
				response.responseStatus = 'S'
				response.reponseMessage = 'Success'
			}
		}
		return res.send(response)
	})
}

//#region Create Public, Private
const generatePublicPrivate = () => {
	const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
		modulusLength: 2048,
	})
	const exportedPublicKeyBuffer = publicKey.export({ type: 'pkcs1', format: 'pem' })
	fs.writeFileSync('public/public.pem', exportedPublicKeyBuffer, { encoding: 'utf-8' })

	const exportedPrivateKeyBuffer = privateKey.export({ type: 'pkcs1', format: 'pem' })
	fs.writeFileSync('public/private.pem', exportedPrivateKeyBuffer, { encoding: 'utf-8' })
}
//#endregion--------------------



const decryptt = (input) => {
	console.log(input)
}

module.exports = tsdGetConnect
