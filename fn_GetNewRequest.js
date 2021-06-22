const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")

const getRequestDetail = (req, res) => {
	let log_event
	let log_result
	let log_description
	let error_description
	let related_table

	//#region ---ตัวอย่าง Call store with query string ------//
	//--------------create query string ---------------//
	res.setHeader("Content-Type", "application/json")
	const from_date = req.body.from_date === null ? null : req.body.from_date.toString()
	const to_date = req.body.to_date === null ? null : req.body.to_date.toString()
	const department_id = req.body.department_id
	const ip_address = req.body.ip_address === null ? null : req.body.ip_address.toString()
	const create_event_by = req.body.create_event_by === null ? null : req.body.create_event_by.toString()
	const qryString = `EXEC [dbo].[sp_get_new_request]

    @p_from_date = ${from_date},
    @p_to_date = ${to_date}, 
    @p_department_id = ${department_id},
	@ip_address = '${ip_address}'`
    //#endregion --- query string ------//

	log_event = "getRequestDetail"
	related_table = "t_trans_request_detail"

	sql.connect(config, (err) => {
		if (err) {
			log_result = "error"
			log_description = "function sql.connect"
			error_description += err
			saveLog(log_event, log_result, log_description, error_description, related_table, create_event_by, ip_address)
			res.status(400).json({ message: "error", description: error_description })
		} else {
			let request = new sql.Request()
			request.query(qryString, (err, result) => {
				if (err) {
					const request = JSON.stringify(req.body)
					log_result = "error"
					log_description = "function request.query \n"
					error_description = err.originalError + request

					saveLog(log_event, log_result, log_description, error_description, related_table, create_event_by, ip_address)
					res.status(501).json({ message: "error", description: err.originalError.message })
				} else {
					log_result = "success"
					log_description = "EXEC sp_get_request_detail"

					saveLog(log_event, log_result, log_description, error_description, related_table, create_event_by, ip_address)
					res.json(result.recordset)
				}
			})
		}
	})
}

module.exports = getRequestDetail
