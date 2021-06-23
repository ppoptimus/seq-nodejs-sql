const sql = require("mssql")
const config = require("./dbConfig")

const getUserDetail = (req, res) => {
    const user_id = req.query.id;

    sql.connect(config, (err) => {
        if(err){
            res.status(400).json({ message: "error", description: err.originalError.message })
        }

        let request = new sql.Request()

        //---------- Case ไม่ได้ส่ง parameter อะไรมา ---------//
        if(user_id == undefined){
            request.execute("sp_get_all_user", (err, result) => {
                if(err){
                    res.status(501).json({ message: "error", description: err.originalError.message })
                }
                res.status(200).json(result.recordset[0])
            })
        }
        //---------- Case ส่ง id มาเป็น parameter [hostname/api/getUser?id={id}]---------//
        else {
            request.input("user_id", sql.VarChar(50), req.query.id)
            request.execute("sp_get_user_by_id", (err, result) => {
                if(err){
                    res.status(501).json({ message: "error", description: err.originalError.message })
                }
                res.status(200).json(result.recordset[0])
            })
        }
        
    })

    
}

module.exports = getUserDetail;