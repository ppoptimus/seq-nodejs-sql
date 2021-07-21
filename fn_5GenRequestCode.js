const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")

const generateRequestCode = (req, res) => {
    sql.connect(config, (err) => {
        if(err){
            saveLog("generateRequestCode", "error", "sql connect", err.originalError.message, null, req.body.user_name, req.body.ip_address)
            return res.status(400).json({ message: "error", description: err.originalError.message })
        }
        
        let request = new sql.Request()
        request.execute("dbo.sp_auto_generate_code", (err, result) => {
            if(err){
                saveLog("generateRequestCode", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
                return res.status(501).json({ message: "error", description: err.originalError.message })
            }
            saveLog("generateRequestCode", "success", result.returnValue, null, "sp_generate_request_code", req.body.user_name, req.body.ip_address)
            res.status(204).json(result.recordset[0])
        })
    })
}

module.exports = generateRequestCode