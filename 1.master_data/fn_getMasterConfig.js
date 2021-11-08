const sql = require("mssql")
const config = require("../dbConfig")

const getMasterConfig = (req, res) => {
    sql.connect(config, () => {
        try {
            let request = new sql.Request()
            request.execute("sp_get_master_config", (err, result) => {
                if (result) {
                    
                    return res.status(200).json(result.recordset)
                }
            })
        } catch (err) {
            return res.status(501).json({ message: "error", description: err.originalError.message })
        }
    })
}

module.exports = getMasterConfig;