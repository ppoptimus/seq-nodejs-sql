const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")

const getRequestDetail = (req, res) => {
	let log_event
	let log_result
	let log_description
	let error_description
	let related_table

	//#region ---ตัวอย่าง Call store with query string ---------//
	//-----------------create query string -------------------//
	const department_code = req.body.department_code
	const ip_address = req.body.ip_address === null ? null : req.body.ip_address.toString()
	const user_name = req.body.user_name === null ? null : req.body.user_name.toString()
	const qryString = `EXEC [dbo].[sp_get_new_request] @department_code = ${department_code}`
    //#endregion ---------- query string -----------------//

	log_event = "getRequestDetail"
	related_table = "t_trans_request_detail"

	sql.connect(config, (err) => {
		if (err) {
			log_result = "error"
			log_description = "function sql.connect"
			error_description += err
			saveLog(log_event, log_result, log_description, error_description, related_table, user_name, ip_address)
			return res.status(400).json({ message: "error", description: error_description })
		} else {
			let request = new sql.Request()
			request.query(qryString, (err, result) => {
				if (err) {
					const request = JSON.stringify(req.body)
					log_result = "error"
					log_description = "function request.query \n"
					error_description = err.originalError + request

					saveLog(log_event, log_result, log_description, error_description, related_table, user_name, ip_address)
					return res.status(501).json({ message: "error", description: err.originalError.message })
				} else {
					log_result = "success"
					log_description = "EXEC sp_get_request_detail"

					saveLog(log_event, log_result, log_description, error_description, related_table, user_name, ip_address)
					return res.json(result.recordset)
				}
			})
		}
	})
}

module.exports = getRequestDetail
