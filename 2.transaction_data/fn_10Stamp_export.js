const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const stampExport = (req, res) => {
    sql.connect(config, (err) => {
        if(err){
            saveLog("stampExport", "error", "sql connect", err.originalError.message, null, req.body.user_name, req.body.ip_address)
            return res.status(400).json({ message: "error", description: err.originalError.message })
        }

        let request = new sql.Request()
        request.input("request_code", sql.NVarChar(10), req.body.request_code)
        request.input("user_name", sql.NVarChar(50), req.body.user_name)
        request.execute("sp_stamp_export", (err, result) => {
            if(err){
                saveLog("stampExport", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
                return res.status(501).json({ message: "error", description: err.originalError.message })
            }
            saveLog("stampExport", "success", 'export request code = '+ req.body.request_code, null, "sp_stamp_export", req.body.user_name, req.body.ip_address)
            res.status(204).json(result.recordset[0])
        })
    })
}

module.exports = stampExport;