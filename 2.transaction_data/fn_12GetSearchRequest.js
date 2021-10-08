const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const searchRequest = (req, res) => {
    sql.connect(config, () => {
        try {
            let request = new sql.Request()
			request.input("request_code", sql.NVarChar(10), req.body.request_code)
            request.input("employer_account", sql.NVarChar(10), req.body.employer_account)
            request.input("refference_id", sql.NVarChar(20), req.body.refference_id)
            request.input("employer_name", sql.NVarChar(100), req.body.employer_name)
            request.input("personal_type", sql.Int, req.body.personal_type)
            request.input("department_code", sql.NVarChar(10), req.body.department_code)
            request.input("request_status", sql.Int, req.body.request_status)
			request.execute("sp_get_trans_request", (err, result) => {
                saveLog("get request", "success", "execute store", null, null, req.body.user_name, req.body.ip_address)
                res.status(200).json(result.recordset)
            })
        } catch (err) {
            saveLog("get request", "error", "execute store", err.originalError, null, req.body.user_name, req.body.ip_address)
            return res.status(400).json({ message: "error", description: err.originalError.message })
        }
    })
}

module.exports = searchRequest