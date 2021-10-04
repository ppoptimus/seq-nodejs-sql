const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const newsManagement = (req, res) => {
    sql.connect(config, () => {
        try {
            let request = new sql.Request()
            
            request.input("news_status", sql.NVarChar(100), req.body.news_status)
            request.input("news_description", sql.NVarChar(255), req.body.news_description)
            request.input("user_name", sql.NVarChar(20), req.body.user_name)
            request.execute("sp_news_management", (err, result) => {
                if(err){
                    saveLog("create nwes", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
                    return res.status(500).json({ message: "error", description: err.originalError.message })
                }
            return res.status(200).json(result.recordset)
            })
        } catch (err) {
            saveLog("create nwes", "error", "sql", err.originalError.message, null, req.body.create_by, req.body.ip_address)
            return res.status(501).json({ message: "error", description: err.originalError.message })
        }
    })
}

module.exports = newsManagement;