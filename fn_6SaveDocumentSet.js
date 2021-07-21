const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")

const saveDocumentSet = (req, res) => {
    sql.connect(config, (err) => {
        if(err){
            saveLog("saveDocumentSet", "error", "sql connect", err.originalError.message, null, req.body.user_name, req.body.ip_address)
            return res.status(400).json({ message: "error", description: err.originalError.message })
        }

        let request = new sql.Request()
        request.input("request_code", sql.NVarChar(20), req.body.request_code)
		request.input("document_set_no", sql.NVarChar(20), req.body.document_set_no)
        request.input("user_name", sql.NVarChar(20), req.body.user_name)
        request.execute("sp_save_document_set", (err, result) => {
            if(err){
                saveLog("saveDocumentSet", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
                return res.status(501).json({ message: "error", description: err.originalError.message })
            }
            else{
                if(result.recordset[0].result == "exists"){
					saveLog("saveDocumentSet", "pass", "exists document No.", null, "t_trans_request", req.body.user_name, req.body.ip_address)
					return res.status(200).json(result.recordset[0])
				}

                saveLog("saveDocumentSet", "success", 'request code = '+ req.body.request_code, null, "sp_stamp_document_set", req.body.user_name, req.body.ip_address)
                res.status(204).json(result.recordset[0])
            }
        })
    })
}
module.exports = saveDocumentSet;