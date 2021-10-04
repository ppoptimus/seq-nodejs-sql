const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const configManagement = (req, res) => {
    sql.connect(config, () => {
        try {
            let request = new sql.Request()
            
            request.input("min_value", sql.Int, req.body.min_value)
            request.input("max_value", sql.Int, req.body.max_value)
            request.execute("sp_config_management", (err, result) => {
                if(err){
                    saveLog("config min max", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
                    return res.status(500).json({ message: "error", description: err.originalError.message })
                }
            return res.status(200).json(result.recordset)
            })
        } catch (err) {
            saveLog("config min max", "error", "sql", err.originalError.message, null, req.body.create_by, req.body.ip_address)
            return res.status(501).json({ message: "error", description: err.originalError.message })
        }
    })
}

module.exports = configManagement;