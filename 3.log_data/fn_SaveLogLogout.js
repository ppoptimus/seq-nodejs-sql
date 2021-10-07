const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const saveLogLogout = (req, res) => {
    sql.connect(config, () => {
        try {
            let request = new sql.Request()
            request.input("token_id", sql.NVarChar(100), req.body.token_id)
            request.input("user_name", sql.NVarChar(20), req.body.user_name)
			request.execute("sp_save_log_logout", (err, result) => {
                res.status(200).json(result.recordset)
            })
        } catch (err) {
            saveLog("logout", "error", "execute store", err.originalError, null, req.body.user_name, req.body.ip_address)
            return res.status(400).json({ message: "error", description: err.originalError.message })
        }
    })
}

module.exports = saveLogLogout