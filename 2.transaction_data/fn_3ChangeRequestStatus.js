const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const changeRequestStatus = (req, res) => {
    sql.connect(config, (err) => {
        if(err){
            saveLog("changeRequestStatus", "error", "sql connect", err.originalError.message, null, req.body.user_name, req.body.ip_address)
            return res.status(400).json({ message: "error", description: err.originalError.message })
        }
        let request = new sql.Request()
		request.input("new_request_id", sql.Int, req.body.new_request_id)
		request.input("status_id", sql.Int, req.body.status_id)
        request.input("remark", sql.NVarChar(255), req.body.remark)
        request.execute("sp_change_request_status_edit", (err, result) => {
            if(err){
                saveLog("changeRequestStatus", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
                return res.status(501).json({ message: "error", description: err.originalError.message })
            }
            saveLog("changeRequestStatus", "success", 'request_id = '+ req.body.new_request_id, null, "t_trans_request_detail", req.body.user_name, req.body.ip_address)
            res.status(204).json(result.recordset[0])
        })
    })
}

module.exports = changeRequestStatus;