const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const saveMasterBank = (req, res) => {
    sql.connect(config, (err) => {
        try {
            let request = new sql.Request()
            request.input("bank_code", sql.NVarChar(5), req.body.bank_code)
            request.input("bank_name", sql.NVarChar(50), req.body.bank_name)
            request.input("address", sql.NVarChar(255), req.body.address)
            request.input("email", sql.NVarChar(50), req.body.email)
            request.input("user_name", sql.NVarChar(20), req.body.user_name)
            request.execute("sp_save_master_bank", (err, result) => {
            if(err){
                saveLog("saveMasterBank", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
                return res.status(501).json({ message: "error", description: err.originalError.message })
            }
            return res.status(200).json(result.recordset)
        })
        } catch (err) {
            saveLog("saveMasterBank", "error", "request sql execute", err.originalError.message, null, req.body.user_name, req.body.ip_address)
            return res.status(501).json({ message: "error", description: err.originalError.message })
        }
        
    })
}

module.exports = saveMasterBank;