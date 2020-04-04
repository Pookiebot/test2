/* eslint-disable*/

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    if (message.author.bot) return;

    if (!message.channel.permissionFor(message.guild.me).missing("SEND_MESSAGES")
    ) 
      return;
    //    Parametres
    const settings = this.client.getSettings(message.guild);
    message.settings = settings;

    if (message.content.indexOf(settings.prefix) !== 0) return;

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    const level = this.client.permlevel(message);

    const cmd = this.client.commands.get(command) || this.client.commands.get
    (this.client.aliases.get(command));
    if (!cmd) return;

    if (level < this.client.levelCache[cmd.cnf.permLevel]) {
      if (settings.systemNotice === "true") {
         return message.channel.send(`Vous n'avez pas la permission pour utiliser cette commande.
         Votre niveau de permisson est ${level} (${
             this.client.config.permLevels.find(l => l.level === level).name
            })
            Cette commende requiert le niveau de permission:  ${
                this.client.levelCache[cmd.conf.permLevel]
            } (${cmd.conf.permLevel})`);
      }  else {
          return;
      }
    }

    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === ".") {
        message.flags.push(args.shift().slice(1));
    }

    // Lancement de la commande
    this.client.logger.log(`${this.client.config.permLevel.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) lance lance la commande ${cmd.help.name}`);
    cmd.run(message, args, level);
  }
};