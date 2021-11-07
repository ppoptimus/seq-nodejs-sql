const sql = require("mssql")
const config = require("../dbConfig")
const { authenticate } = require("ldap-authentication")

const ldapSearch = async (req, res) => {
  try {
    //------- case search for username --------
    try {
      let options = {
        ldapOpts: { url: "ldap://172.20.10.17:389" },
        userDn: "uid=appssows,cn=App,ou=internal,DC=ESSS,DC=SSO,DC=GO,DC=TH",
        userPassword: "Tory<oN",
        userSearchBase: "cn=Users,ou=internal,dc=ESSS,dc=SSO,dc=GO,dc=TH",
        usernameAttribute: 'uid',
        username: req.body.user_name,
      }
      let user = await authenticate(options)
      let userDetail = (!!user) ? {
        user_name: user.uid,
        first_name: user.ssofirstname,
        last_name: user.ssosurname,
        personal_id: user.ssopersoncitizenid,
        department_code: user.SSObranchCode,
      } : null;
      return res.status(200).json(userDetail)
    }
    //------- case search for citizenid --------
    catch {
      let options = {
        ldapOpts: { url: "ldap://172.20.10.17:389" },
        userDn: "uid=appssows,cn=App,ou=internal,DC=ESSS,DC=SSO,DC=GO,DC=TH",
        userPassword: "Tory<oN",
        userSearchBase: "cn=Users,ou=internal,dc=ESSS,dc=SSO,dc=GO,dc=TH",
        usernameAttribute: 'ssopersoncitizenid',
        username: req.body.user_name,
      }
  
      let user = await authenticate(options)
      let userDetail = (!!user) ? {
        user_name: user.uid,
        first_name: user.ssofirstname,
        last_name: user.ssosurname,
        personal_id: user.ssopersoncitizenid,
        department_code: user.SSObranchCode,
      } : null;
      
      return res.status(200).json(userDetail)
    }
  } catch (err) {
    return res.status(203).json({ message: "error", description: "Invalid Credentials" })
  }
}

module.exports = ldapSearch;