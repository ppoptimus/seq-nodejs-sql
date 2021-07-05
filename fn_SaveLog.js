const sql = require("mssql")
const config = require('./dbConfig')

const saveLog = (log_event, log_result, log_description, error_description, related_table, create_by, ip_address) => {
	sql.connect(config, () => {
		let request = new sql.Request()
		request.input("log_event", sql.VarChar(50), log_event)
		request.input("log_result", sql.VarChar(50), log_result)
		request.input("log_description", sql.VarChar(2000), log_description)
        request.input("error_description", sql.VarChar(4000), error_description)
		request.input("related_table", sql.VarChar(50), related_table)
		request.input("create_by", sql.VarChar(50), create_by)
		request.input("ip_address", sql.VarChar(50), ip_address)
		request.execute("sp_save_log_event")
	})
}

module.exports = saveLog;