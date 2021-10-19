const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const deleteMasterUser = (req, res) => {
  sql.connect(config, (err) => {
    let request = new sql.Request()
    request.input("del_user_id", sql.Int, req.body.del_user_id)
    request.input("del_user_name", sql.NVarChar(50), req.body.del_user_name)
    request.input("user_name", sql.NVarChar(50), req.body.user_name)
    request.execute("sp_delete_master_user", (err, result) => {
      if(err){
        saveLog("delete user", "error", "execute store", err.originalError.message, null, req.body.user_name, req.body.ip_address)
        return res.status(501).json({ message: "error", description: err.originalError.message })
      }
      saveLog("delete user", "success", "execute store", null, null, req.body.user_name, req.body.ip_address)
      return res.status(200).json(result.recordset)
    })
  })
}

module.exports = deleteMasterUser