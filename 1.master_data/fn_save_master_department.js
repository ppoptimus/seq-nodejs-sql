const sql = require("mssql")
const config = require("../dbConfig")

const saveMasterDepartment = (req, res) => {
	sql.connect(config, () => {
        let request = new sql.Request()
        try {
            request.input("department_code", sql.NVarChar(10), req.body.department_code)
            request.input("department_name", sql.NVarChar(50), req.body.department_name)
            request.input("status", sql.Int, req.body.status)
            request.input("user_name", sql.NVarChar(20), req.body.user_name)
            request.execute("sp_save_master_department", (err, result) => {
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
module.exports = saveMasterDepartment
