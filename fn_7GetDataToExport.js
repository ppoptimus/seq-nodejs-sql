const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")

const getExport = (req, res) => {
	sql.connect(config, (err) => {
		if (err) {
			saveLog("export request", "error", "sql connect", err.originalError.message, null, req.body.user_name, req.body.ip_address)
			return res.status(400).json({ message: "error", description: err.originalError.message })
		} else {
			let request = new sql.Request()
			request.input("request_code", sql.NVarChar(10), req.body.request_code)
			request.input("document_set_no", sql.NVarChar(50), req.body.document_set_no)
			request.execute("sp_export_request", (err, result) => {
				if (err) {
					saveLog("export request", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
					return res.status(501).json({ message: "error", description: err.originalError.message })
				}
				saveLog(
					"export request",
					"success",
					"export request code = " + req.body.request_code,
					null,
					"sp_export_request",
					req.body.user_name,
					req.body.ip_address
				)
				res.status(200).json(result.recordset)
			})
		}
	})
}
module.exports = getExport
