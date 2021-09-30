const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const searchRequestDetail = (req, res) => {
    
    sql.connect(config, () => {
        try {
            let request = new sql.Request()
			request.input("request_code", sql.VarChar(50), req.query.request_code)
            request.execute("sp_get_trans_request_detail", (err, result) => {
                res.status(200).json(result.recordset)
            })
        } catch (err) {
            return res.status(400).json({ message: "error", description: err.originalError.message })
        }
    })
}

module.exports = searchRequestDetail