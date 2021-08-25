const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")

const ImportBank = (req, res) => {
	sql.connect(config, () => {
		try {
			let request = new sql.Request()
			request.input("request_code", sql.NVarChar(10), req.body.request_code)
			request.input("bank_code", sql.NVarChar(10), req.body.bank_code)

            return res.status(200).json(req.body)
		} catch (err) {
			saveLog("Import file", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
			return res.status(501).json({ message: "error", description: err.originalError.message })
		}
	})
}

module.exports = ImportBank;
