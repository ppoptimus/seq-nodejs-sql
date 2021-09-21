const sql = require("mssql")
const config = require("./dbConfig")

const getAllRequest = (req, res) => {
    
    sql.connect(config, () => {
        try {
            let request = new sql.Request()
            request.execute("sp_get_all_request", (err, result) => {
                res.status(200).json(result.recordset)
            })
        } catch (err) {
            return res.status(400).json({ message: "error", description: err.originalError.message })
        }
    })
}

module.exports = getAllRequest