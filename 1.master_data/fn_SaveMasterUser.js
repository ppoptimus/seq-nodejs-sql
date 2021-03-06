const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const saveMasterUser = (req, res) => {
	sql.connect(config, () => {
		try {
			let request = new sql.Request()
			request.input("user_name", sql.NVarChar(20), req.body.user_name)
			request.input("first_name", sql.NVarChar(50), req.body.first_name)
			request.input("last_name", sql.NVarChar(50), req.body.last_name)
			request.input("personal_id", sql.NVarChar(20), req.body.personal_id)
			request.input("department_code", sql.NVarChar(5), req.body.department_code)
			request.input("userlevel_id", sql.Int, req.body.userlevel_id)
			request.input("status_id", sql.Int, req.body.status_id)
			request.input("create_by", sql.NVarChar(20), req.body.create_by)
			request.execute("sp_save_master_user", (err, result) => {
                if (result.recordset[0].result === 0) {
                    saveLog("Save new user", "error", "exec store", result.recordset[0].resultMessage, 't_master_user', req.body.create_by, req.body.ip_address)
                    return res.status(415).json(result.recordset)
                }
                else {
                    
                    saveLog("Save new User", "success", req.body.user_name, null, 't_master_user', req.body.create_by, req.body.ip_address)
                    return res.status(200).json(result.recordset)
                }
			})
		} catch (err) {
			saveLog("Save new user", "error", "request body", err.originalError.message, 't_master_user', req.body.create_by, req.body.ip_address)
			return res.status(501).json({ message: "error", description: err.originalError.message })
		}
	})
}

module.exports = saveMasterUser
