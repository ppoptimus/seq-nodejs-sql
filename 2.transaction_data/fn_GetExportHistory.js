const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const getExportHistory = (req, res) => {
	sql.connect(config, () => {
		try {
			let request = new sql.Request()
			request.input("request_code", sql.NVarChar(20), req.body.request_code)
			request.execute("sp_get_export_history", (err, result) => {
				saveLog("get export history", "success", null, null, "sp_get_export_history", req.body.user_name, req.body.ip_address)
				res.status(200).json(result.recordset)
			})
		} catch (err) {
			saveLog("get export history", "error", err.originalError.message, null, "t_trans_request_detail", req.body.user_name, req.body.ip_address)
			return res.status(400).json({ message: "error", description: err.originalError.message })
		}
	})
}
module.exports = getExportHistory
