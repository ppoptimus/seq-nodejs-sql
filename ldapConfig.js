const ldapConfig = {
  ldapOpts: { url: "ldap://172.20.10.17:389" },
  userDn: "uid=appssows,cn=App,ou=internal,DC=ESSS,DC=SSO,DC=GO,DC=TH",
  userPassword: "Tory<oN",
  userSearchBase: "cn=Users,ou=internal,dc=ESSS,dc=SSO,dc=GO,dc=TH",
}

module.exports = ldapConfig