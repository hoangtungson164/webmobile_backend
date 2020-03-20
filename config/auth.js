require('dotenv').config();
module.exports = {
    user          : "admin",
  
    // Get the password from the environment variable
    // NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
    // string (not recommended), or it could be prompted for.
    // Alternatively use External Authentication so that no password is
    // needed.
    //password      : process.env.PASSWORD,
    password : "admin200%scrp",
    // For information on connection strings see:
    // https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings
    // connectString : "localhost/infobox",
    // connectString : "192.168.22.179/xe",
    connectString : "10.84.243.126:1522/VNDEV",
    // Setting externalAuth is optional.  It defaults to false.  See:
    // https://oracle.github.io/node-oracledb/doc/api.html#extauth
    // externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
  };
