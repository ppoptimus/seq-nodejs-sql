const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const searchRequest = (req, res) => {
    sql.connect(config, () => {
        try {
            let request = new sql.Request()
			request.input("request_code", sql.NVarChar(10), req.body.request_code)
			request.input("from_date", sql.NVarChar(20), req.body.from_date)
            request.input("to_date", sql.NVarChar(20), req.body.to_date)
			request.input("request_status", sql.Int, req.body.request_status)
			request.execute("sp_get_request", (err, result) => {
                console.log(result)
                return res.status(200).json(result.recordset)
            })
        } catch (err) {
            console.log(err)
        }
    })
}

module.exports = searchRequest