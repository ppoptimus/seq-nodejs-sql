const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const getWaitingGenerate = (req, res) => {
	sql.connect(config, () => {
		try {
			let request = new sql.Request()
			request.execute("sp_get_waiting_generate", (err, result) => {
				saveLog("get waiting for generate", "success", null, null, "sp_get_waiting_generate", req.body.user_name, req.body.ip_address)
				res.status(200).json(result.recordset[0])
			})
		} catch (err) {
			saveLog("get waiting for generate", "error", err.originalError.message, null, "sp_get_waiting_generate", req.body.user_name, req.body.ip_address)
			return res.status(400).json({ message: "error", description: err.originalError.message })
		}
	})
}
module.exports = getWaitingGenerate
