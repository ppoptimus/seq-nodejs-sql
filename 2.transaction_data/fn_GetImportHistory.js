const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const getImportHistory = (req, res) => {
	sql.connect(config, () => {
		try {
			let request = new sql.Request()
			request.execute("sp_get_import_history", (err, result) => {
				res.status(200).json(result.recordset)
			})
		} catch (err) {
			saveLog("get import history", "error", "execute store", err.originalError, null, req.body.user_name, req.body.ip_address)
			return res.status(400).json({ message: "error", description: err.originalError.message })
		}
	})
}

module.exports = getImportHistory
