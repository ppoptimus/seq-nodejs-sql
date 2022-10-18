const sql = require('mssql')
const config = require('../dbConfig')
const saveLog = require('../fn_SaveLog')
const crypto = require('crypto')
const fs = require('fs')
const encryption = require('./fn_EncryptBody')
const decryption = require('./fn_DecryptBody')

const tsdGetConnect = (req, res) => {
	const apiKey = req.headers['api-key']

	//#region decript secret
	
	//#endregion decript secret
	// ------------------------------------------------------------------------------------------------------------------------------------

	//#region decript input 

	//#endregion decript input 
	// ------------------------------------------------------------------------------------------------------------------------------------

	//#region response 
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
	//#endregion response 
}

//#region Create Public Private
const generatePublicPrivate = () => {
	const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
		modulusLength: 2048,
	})
	const exportedPublicKeyBuffer = publicKey.export({ type: 'pkcs1', format: 'pem' })
	fs.writeFileSync('public/public.pem', exportedPublicKeyBuffer, { encoding: 'utf-8' })

	const exportedPrivateKeyBuffer = privateKey.export({ type: 'pkcs1', format: 'pem' })
	fs.writeFileSync('public/private.pem', exportedPrivateKeyBuffer, { encoding: 'utf-8' })
}
//#endregion
// ------------------------------------------------------------------------------------------------------------------------------------

module.exports = tsdGetConnect
