const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const getconnection = (req,res) => {
  const headerKey = req.headers['api-key']
  const username = req.body.username
  const password = req.body.password
  let response = {
    responseCode : '',
    responseStatus : '',
    reponseMessage: ''
  }
  
	sql.connect(config, (err) => {
		if (err) {
			  response.responseCode = '909'
        response.responseStatus = 'E'
        response.reponseMessage = 'Failed to connec Database'
		}else {
			if(true){
        response.responseCode = '000'
        response.responseStatus = 'S'
        response.reponseMessage = 'Success'
      }
		}
		return res.send(response)
	})
}

module.exports = getconnection;