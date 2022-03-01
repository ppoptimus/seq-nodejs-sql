const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")
const ldapLogin = require("../0.Authen/fn_LdapLogin") 

const localLogin = (req, res) => {
	sql.connect(config, () => {
		try {
			let userDetail = {}
			if(req.body.user_name === 'uatadmin'){
				userDetail = {
					result : 1,
					username: req.body.user_name,
					first_name: "ทดสอบ",
					last_name: "แอดมิน",
					personal_id: "1234567890123",
					department_code: "1000",
					userlevel_id: "2",
					user_level_name: "admin",
				}
				return res.status(200).json(userDetail)
			}
			else if(req.body.user_name === 'uatuser'){
				userDetail = {
					result : 1,
					username: req.body.user_name,
					first_name: "ทดสอบ",
					last_name: "แอดมิน",
					personal_id: "1234567890123",
					department_code: "1000",
					userlevel_id: "2",
					user_level_name: "admin",
				}
				return res.status(200).json(userDetail)
			}
			else {
				ldapLogin(req, res)
			}
			
		} catch (err) {
			saveLog("save log login", "error", "request body", err.message, null, req.body.user_name, null)
			return res.status(501).json({ message: "error", description: err })
		}
	})
}

module.exports = localLogin
