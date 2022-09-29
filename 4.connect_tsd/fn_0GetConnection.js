const sql = require('mssql')
const config = require('../dbConfig')
const saveLog = require('../fn_SaveLog')
const crypto = require('crypto')
const fs = require('fs')

const tsdGetConnect = (req, res) => {
	const apiKey = req.headers['api-key']
	const input = req.body.input
	const secret = req.body.secret

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
	// console.log(decryptedSecret.toString('utf8'))
	//#endregion decript secret--------------------------------

	//#region decript input -------------------------------
	// encrypt(input, decryptedSecret.toString('utf8'))
	decrypt()
	//#endregion decript input -------------------------------

	// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	//   modulusLength: 2048,
	// })
	// const exportedPublicKeyBuffer = publicKey.export({ type: 'pkcs1', format: 'pem' })
	// fs.writeFileSync('public/public.pem', exportedPublicKeyBuffer, { encoding: 'utf-8' })

	// const exportedPrivateKeyBuffer = privateKey.export({ type: 'pkcs1', format: 'pem' })
	// fs.writeFileSync('public/private.pem', exportedPrivateKeyBuffer, { encoding: 'utf-8' })

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

function encrypt() {
	const plainText = '{"username":"TSD","password":"Tsd@12345#."}'
	key = 'g7uq/8Cj+vmVHYhYOy0Wtw=='

	const iv = crypto.randomBytes(16).toString('hex').slice(0, 16)
	const encrypter = crypto.createCipheriv('aes-256-cbc', key, iv)
	let encryptedMsg = encrypter.update(plainText, 'utf8', 'hex')
	encryptedMsg += encrypter.final('hex')

	console.log(encryptedMsg)
}

function decrypt() {
	const key = 'g7uq/8Cj+vmVHYhYOy0Wtw=='
	const encryptText = '4XtbqrJONmWkfHzzAgDJ3B4SIfIvjy9t0N+OYrX51G2a30ZIqktKg3xQBGs/FvZ4SphVwVpDEoMifWDyyPiO3A=='
	
	const CryptoJS = require("crypto-js");

var data = ['{"username":"TSD","password":"Tsd@12345#."}']

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'g7uq/8Cj+vmVHYhYOy0Wtw==').toString();

// Decrypt
var bytes  = CryptoJS.AES.decrypt(encryptText, 'g7uq/8Cj+vmVHYhYOy0Wtw==');
var decryptedData = bytes.toString(CryptoJS.AES.Utf8);

console.log('text=',decryptedData); // [{id: 1}, {id: 2}]
}

module.exports = tsdGetConnect
