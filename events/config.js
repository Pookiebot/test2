const mysql = require("mysql");
const DB = require("./modules/db.js");
async function getConfig(guildId) {
  const db = mysql.createConnection(DB)
  db.connect(function(err) {
    if (err) throw err;
  })
  const Prefix = async () => {
    await db.query(`SELECT prefix FROM server WHERE server_id = '${guildId}`, (err, rows) => {
      if (err) throw err;
    })
  return {
        defaultSettings: {
        prefix: Prefix,
        modLogChannel : "silent-logs",
        helperRole : "GH",
        modRole :  "GM",
        supermodRole :  "SGM",
        adminRole : "GA",
        systemNotice : true
      },
      permLevels: [
        { level: 0, name: "Utilisateur", check: () => true },
        {
          level: 1,
          name: "GH",
          check: message => {
            try {
              const helperRole = message.guild.roles.find(
                r => r.name.toLowerCase() === message.settings.modRole.toLowerCase()
              );
              if (helperRole && message.member.roles.has(helperRole.id)) return true;
            } catch (e) {
              return false;
            }
          }
        },
        {
          level: 2,
          name: "GM",
          check: message => {
            try {
              const modRole = message.guild.roles.find(
                r => r.name.toLowerCase() === message.settings.modRole.toLowerCase()
              );
              if (modRole && message.member.roles.has(modRole.id)) return true;
            } catch (e) {
            return false;
            }
          }
        },
        {
          level: 3,
          name: "SGM",
          check: message => {
            try {
              const supermodRole = message.guild.roles.find(
                r => r.name.toLowerCase() === message.settings.modRole.toLowerCase()
              );
              if (supermodRole && message.member.roles.has(supermodRole.id)) return true;
            } catch (e) {
              return false;
            }
          }
        },
        {
          level: 4,
          name: "GA",
          check: message => {
            try {
              const adminRole = message.guild.roles.find(
                r =>
                  r.name.toLowerCase() === message.settings.adminRole.toLowerCase()
              );
              if (adminRole && message.member.roles.has(adminRole.id)) return true;
            } catch (e) {
              return false;
            }
          }
        },
        {
          level: 5,
          name: "Owner",
          check: message => message.client.appInfo.owner.id === message.author.id
        },
        {
          level: 6,
          name: "Pookie",
          check: message => message.author.id === null
        }
      ]
    }
  }
}
module.exports.getConfig = getConfig;
