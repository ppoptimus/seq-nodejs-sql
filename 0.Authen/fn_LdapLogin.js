const sql = require("mssql")
const config = require("../dbConfig")
const ldapConfig = require("../ldapConfig")
const { authenticate } = require("ldap-authentication")

const ldapLogin = async (req, res) => {
	try {
		let options = {
			ldapOpts: ldapConfig.ldapOpts,
			userDn: ldapConfig.userDn,
			userPassword: ldapConfig.userPassword,
			userSearchBase: ldapConfig.userSearchBase,
			usernameAttribute: "uid",
			username: req.body.user_name,
		}

		let user = await authenticate(options)
		let optionsauthen = {
			ldapOpts: ldapConfig.ldapOpts,
			userDn: user.dn,
			userPassword: req.body.pwd,
		}
		let userauthen = await authenticate(optionsauthen)

		if (userauthen) {
			sql.connect(config, () => {
				let request = new sql.Request()
				request.input("user_name", sql.NChar(50), user.uid)
				request.input("first_name", sql.NChar(50), user.ssofirstname)
				request.input("last_name", sql.NChar(50), user.ssosurname)
				request.input("department_code", sql.NChar(50), user.SSObranchCode)
				request.execute("sp_user_login", (err, result) => {
					if (err) {
						res.status(501).json({ message: "error", description: err.originalError.message })
					}
					res.status(200).json(result.recordset[0])
				})
			})
		}

	} catch (err) {
		return res.status(203).json({ result: 0, resultMessage: "โปรดตรวจสอบ username นี้ในระบบส่วนกลาง" })
	}
}

module.exports = ldapLogin
