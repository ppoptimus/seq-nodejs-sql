const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const deleteImportBank = (req, res) => {
    sql.connect(config, (err) => {
      if(err){
        return res.status(400).json({ message: "error", description: err.originalError.message })
      }
      try {
        let request = new sql.Request()
        request.input('bank_code', sql.NVarChar(10), req.body.bank_code)
        request.input('user_name', sql.NVarChar(50), req.body.user_name)
        request.input('ip_address', sql.NVarChar(50), req.body.ip_address)
        request.execute('sp_delete_import_bank')
      } catch (err) {
        
      }
      return res.status(200).json({result:'test'})
    })

    // saveLog("deleteImportBank", "error", "sql connect", err.originalError.message, null, req.body.user_name, req.body.ip_address)
    // return res.status(400).json({ message: "error", description: err.originalError.message })
}

module.exports = deleteImportBank;