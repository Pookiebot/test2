const mysql = require("mysql");
const DB = require("./db.js");
async function getConfig(guildId) {
  const db = mysql.createPool(DB);
  let prefix = db.query(`SELECT prefix FROM server WHERE server_id = `)
  return {
        Settings: {
        prefix: prefix,
        modLogChannel : "silent-logs",
        helperRole : "GH",
        modRole :  "GM",
        supermodRole :  "SGM",
        adminRole : "GA",
        systemNotice : true
      }
    }
  }
module.exports = getConfig;
