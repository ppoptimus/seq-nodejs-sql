const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")

const getAllBank = () => {
    let results;
    sql.connect(config, (err) => {
        if (err) {
			saveLog("get all banks", "error", "sql connect", err.originalError.message, null, null, null)
			return err.originalError.message
		} else {
            let request = new sql.Request()
			request.execute("sp_get_all_banks", (err, result) => {
                if (err) {
					saveLog("get all banks", "error", "request body", err.originalError.message, null, null, null)
					return err.originalError.message
				} else {
                    saveLog(
						"get all banks",
						"success",
						null,
						null,
						"t_master_bank",
						null, null
					)
                    results = result.recordset
                    return result.recordset
                }
            })
        }
    })
}

module.exports = getAllBank;