const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")
const ldap = require("ldapjs")
const ldapLogin = require("../0.Authen/fn_LdapLogin")

const localLogin = (req, res) => {
	sql.connect(config, () => {
		try {
			let request = new sql.Request()
			request.input("user_name", sql.NVarChar(50), req.body.user_name)
			request.execute("sp_save_log_login", () => {})
			let userDetail = {}
			switch (req.body.user_name) {
				case "uatadmin":
					userDetail = {
						user_name: req.body.user_name,
						first_name: "ทดสอบ",
						last_name: "แอดมิน",
						personal_id: "1234567890123",
						department_code: "1000",
						userlevel_id: "2",
						user_level_name: "admin",
					}
					return res.status(200).json(userDetail)
					break

				case "uatuser":
					userDetail = {
						user_name: req.body.user_name,
						first_name: "ทดสอบ",
						last_name: "ผู้ใช้สาขา",
						personal_id: "1234567890123",
						department_code: "1003",
						userlevel_id: "3",
						user_level_name: "user",
					}
					return res.status(200).json(userDetail)
					break
				default:
					ldapLogin(req, res);
					break
			}
		} catch (err) {
			saveLog("save log login", "error", "request body", err.message, null, req.body.user_name, null)
			return res.status(501).json({ message: "error", description: err })
		}
	})
}

//#region  waiting remove ---------------------------------------
// const ldapLogin1 = (username, password) => {
// 	let dataset = {}
// 	try {
// 		const client = ldap.createClient({
// 			url: "ldap://172.20.10.17:389",
// 		})

// 		client.bind("uid=appssows,cn=App,ou=internal,DC=ESSS,DC=SSO,DC=GO,DC=TH", "Tory<oN", () => {
// 			const opts = {
// 				filter: `(&(uid=${username})(accountActive=TRUE))`,
// 				scope: "sub",
// 				attributes: ["givenName", "sn", "cn", "SSObranchCode", "ssofirstname", "ssosurname", "ssopersoncitizenid", "uid"],
// 			}

// 			client.search("cn=Users,ou=internal,dc=ESSS,dc=SSO,dc=GO,dc=TH", opts, (err, res) => {
// 				if (err) {
// 					console.log(err)
// 				} else {
// 					res.on("searchEntry", (entry) => {
// 						let SSObranchCode = JSON.stringify(entry.object.SSObranchCode)
// 						let ssopersoncitizenid = JSON.stringify(entry.object.ssopersoncitizenid)
// 						let uid = JSON.stringify(entry.object.uid)
// 						let ssofirstname = JSON.stringify(entry.object.ssofirstname)
// 						let ssosurname = JSON.stringify(entry.object.ssosurname)
// 						dataset = {
// 							SSObranchCode: SSObranchCode,
// 							ssopersoncitizenid: ssopersoncitizenid,
// 							uid: uid,
// 							ssofirstname: ssofirstname,
// 							ssosurname: ssosurname,
// 						}
// 						returnObject(dataset)
// 					})
// 				}
// 			})
// 		})
// 	} catch (error) {
// 		console.log(error)
// 	}
// }

// const returnObject = (req, res) => {
// 	try {
// 		let obj = JSON.stringify(req)
// 		return obj
// 	} catch (error) {
// 		return error
// 	}
// }
//#endregion --------------------------------------

module.exports = localLogin
