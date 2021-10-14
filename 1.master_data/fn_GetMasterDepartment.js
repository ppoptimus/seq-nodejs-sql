const sql = require("mssql")
const config = require("../dbConfig")

const getMasterDepartment = (req, res) => {
	sql.connect(config, () => {
        let request = new sql.Request()
        try {
            request.execute("sp_get_master_department", (err, result) => {
                if(result){
                    return res.status(200).json(result.recordset)
                }
                res.status(200).json(result)
            })
        } catch (err) {
            return res.status(501).json({ message: "error", description: err.originalError.message })
        }
		
	})
}
module.exports = getMasterDepartment
