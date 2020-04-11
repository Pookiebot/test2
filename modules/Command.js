class Command {
  constructor(client,
    {
      name = null,
      description ="Aucune description détéctée.",
      category =  "Utilisateur",
      usage = "Aucune utilisation détéctée",
      enabled = true,
      guildOnly = false,
      aliases = new Array(),
      permLevel = "Utilisateur",
      host = process.env.MYSQL_HOST,
      port = process.env.MYSQL_PORT,
      user = process.env.MYSQL_USER,
      password = process.env.MYSQL_PASSWORD,
      database = "gardien",
      
    }
  ) {
    this.client = client;
    this.conf = { enabled, guildOnly, aliases, permLevel};
    this.help = {name, description, category, usage};
    this.db = {host, port, user, password, database};
  }
}

module.exports = Command;
