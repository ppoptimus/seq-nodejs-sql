const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const getLogLogin = (req, res) => {
    sql.connect(config, () => {
        try {
            let request = new sql.Request()
            request.input("start_date", sql.NVarChar(10), req.body.start_date)
            request.input("end_date", sql.NVarChar(10), req.body.end_date)
			request.execute("sp_get_log_login", (err, result) => {
                saveLog("get log login", "success", "execute store", null, null, req.body.user_name, req.body.ip_address)
                res.status(200).json(result.recordset)
            })
        } catch (err) {
            saveLog("get log login", "error", "execute store", err.originalError, null, req.body.user_name, req.body.ip_address)
            return res.status(400).json({ message: "error", description: err.originalError.message })
        }
    })
}

module.exports = getLogLogin