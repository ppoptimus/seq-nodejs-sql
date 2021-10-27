const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const editNewRequest = (req, res) => {
    console.log(req.body)
    sql.connect(config, (err) => {
        if(err){
            saveLog("editNewRequest", "error", "sql, connection", err.originalError.message, null, req.body.user_name, req.body.ip_address)
			return res.status(400).json({ message: "error", description: err.originalError.message })
        }
        else {
            let request = new sql.Request()
            request.input("request_detail_id", sql.Int, req.body.request_detail_id)
            request.input("document_no", sql.NVarChar(20), req.body.document_no)
            request.input("document_date", sql.NVarChar(20), req.body.document_date)
            request.input("employer_account", sql.NVarChar(10), req.body.employer_account)
            request.input("refference_id", sql.NVarChar(20), req.body.refference_id)
            request.input("title_code", sql.NVarChar(10), req.body.title_code)
            request.input("first_name", sql.NVarChar(50), req.body.first_name)
            request.input("last_name", sql.NVarChar(50), req.body.last_name)
            request.input("company_name", sql.NVarChar(100), req.body.company_name)
            request.input("birth_date", sql.NVarChar(20), req.body.birth_date)
            request.input("address", sql.NVarChar(255), req.body.address)
            request.input("remark", sql.NVarChar(255), req.body.remark)
            request.input("user_name", sql.NVarChar(50), req.body.user_name)
            request.execute("sp_edit_new_request", (err, result) => {
                if(err){
                    saveLog("editNewRequest", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
				    return res.status(501).json({ message: "error", description: err.originalError.message })
                }
                saveLog("editNewRequest", "success", "request_detail_id = " + req.body.request_detail_id, null, "t_trans_request_detail", req.body.user_name, req.body.ip_address)
				res.status(204).json(result.recordset[0])
            })
        }
    })
}

module.exports = editNewRequest;