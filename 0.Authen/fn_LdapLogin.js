const sql = require("mssql")
const config = require("../dbConfig")
const { authenticate } = require("ldap-authentication")

const ldapLogin = async (req, res) => {
	try {
		let options = {
			ldapOpts: { url: "ldap://172.20.10.17:389" },
			userDn: "uid=appssows,cn=App,ou=internal,DC=ESSS,DC=SSO,DC=GO,DC=TH",
			userPassword: "Tory<oN",
			userSearchBase: "cn=Users,ou=internal,dc=ESSS,dc=SSO,dc=GO,dc=TH",
			usernameAttribute: "uid",
			username: req.body.user_name,
		}

		let user = await authenticate(options)
		let optionsauthen = {
			ldapOpts: { url: "ldap://172.20.10.17:389" },
			userDn: user.dn,
			userPassword: req.body.pwd,
		}
    let useraurthen = await authenticate(optionsauthen)

    let userDetail = (useraurthen) ? {
      username: user.uid,
      first_name: user.ssofirstname,
      last_name: user.ssosurname,
      personal_id: user.ssopersoncitizenid,
      department_code: user.SSObranchCode,
      userlevel_id: 1,
      user_level_name: "admin",
    } : null;
    console.log(userDetail)
		return res.json(userDetail)
	} catch (err) {
		return res.status(200).json({ message: "error", description: "Invalid Credentials" })
	}
}

module.exports = ldapLogin
