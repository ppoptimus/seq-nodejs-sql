// ldap dev
// ldap.ip=ldap://172.16.19.94:389
// ldap uat
// ldap.ip=ldap://172.20.90.139:389
// ldap prod
// ldap.ip=ldap://172.20.10.17:389
// ldap.contextFactory=com.sun.jndi.ldap.LdapCtxFactory
// ldap.securityAuthentication=simple
// ldap.securityPrincipalOptions=cn=Users,ou=internal,DC=ESSS,DC=SSO,DC=GO,DC=TH


const ldapConfig = {
  ldapOpts: { url: "ldap://172.16.19.94:389" },
  userDn: "uid=appssows,cn=App,ou=internal,DC=ESSS,DC=SSO,DC=GO,DC=TH",
  userPassword: "Tory<oN",
  userSearchBase: "cn=Users,ou=internal,dc=ESSS,dc=SSO,dc=GO,dc=TH",
}

module.exports = ldapConfig