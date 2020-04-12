/* eslint-disable */
const DB = require("../modules/db.js");
const mysql = require("mysql");
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    const db = mysql.createConnection(DB);

    if (message.author.bot) return;

    let generatedXp = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
    db.connect(function(err) {
      if (err) throw err;
      db.query(
        `SELECT * FROM players LEFT JOIN server ON id_server = server.server_name WHERE user_id = '${message.author.id}' AND server_id = '${message.guild.id}'`,
        (err, rows) => {
          if (err) throw err;

          if (rows.length < 1) {
            var sql = `INSERT INTO players (id_server, user_id, user, xp, level) VALUES ('${message.guild.name}', '${message.author.id}' , '${message.author.username}', '${generatedXp}', '1')`;
            db.query(sql, function(err, result) {
              if (err) throw err;
              console.log("réussi");
              message.channel
                .send("tu a atteint le niveau 1")
                .then(m => m.delete(2500));
            });
          } else {
            let SNAME = rows[0].user_id;
            let SID = rows[0].server_id;
            if (SID !== message.guild.id) {
              var sql1 = `INSERT INTO players (id_server, user_id, user, xp, level) VALUES ('${message.guild.name}', '${message.author.id}' , '${message.author.username}', '${generatedXp}', '1')`;
              db.query(sql1, function(err, result) {
                if (err) throw err;
                console.log("réussi1");
                message.channel
                  .send("tu a atteint le niveau 1")
                  .then(m => m.delete(2500));
              });
            } else if (SNAME === message.author.id) {
              let xp = rows[0].xp;
              let LEVEL = rows[0].level;
              if (xp >= 300) {
                var sql2 = `UPDATE players SET xp = '0', level ='${LEVEL +
                  1}' WHERE user_id = '${message.author.id}' AND id_server= '${
                  message.guild.name
                }' `;
                db.query(sql2, function(err, result) {
                  if (err) throw err;
                  console.log("réussi2");
                  message.channel.send(
                    `tu a monté un lv, tu es maintenant niveau ${LEVEL + 1}`
                  );
                });
              } else {
                var sql3 = `UPDATE players SET xp = '${xp +
                  generatedXp}' WHERE user_id = '${
                  message.author.id
                }' AND id_server = '${message.guild.name}' `;
                db.query(sql3, function(err, result) {
                  if (err) throw err;
                  console.log("réussi3");
                });
              }
            }
          }
        }
      );
    });
    if (
      !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")
    )
      return;

    // Paramètres
    const settings = await this.client.getSettings(message.guild);
    message.settings = settings;
    function pretes(guildID) {
      return new Promise((resolve, reject) => {
        db.query(
          `SELECT prefix FROM server WHERE server_id = '${guildID}'`,
          function(err, rows) {
            if (err) return reject(err);
            rows = rows[0].prefix;
            resolve(rows);
          }
        );
      });
    }
    const pref = await pretes(message.guild.id);
    if (message.content.indexOf(pref) !== 0) return;

    const args = message.content
      .slice(pref.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member)
      await message.guild.fetchMember(message.author);

    const level = this.client.permlevel(message);

    const cmd =
      this.client.commands.get(command) ||
      this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) return;

    if (level < this.client.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice === "true") {
        return message.channel
          .send(`Vous n'avez pas la permission pour utiliser cette commande.
        Votre niveau de permission est ${level} (${
          this.client.config.permLevels.find(l => l.level === level).name
        })
        Cette commande requirt le niveau de permission: ${
          this.client.levelCache[cmd.conf.permLevel]
        } (${cmd.conf.permLevel})`);
      } else {
        return;
      }
    }

    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }

    // Lancement de la commande
    this.client.logger.log(
      `${message.author.username} (${message.author.id} - ${
        this.client.config.permLevels.find(l => l.level === level).name
      }) lance la commande ${cmd.help.name}`
    );
    cmd.run(message, args, level);
  }
};
