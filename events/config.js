async function getConfig(guildId) {

  const getPrefix = async () => {
    return await //ta query qui récupère le prefix avec guildId passé en paramètre de getConfig
  }

  return {
    defaultSettings: {
      prefix: await getPrefix(),
      modLogchannel: "",
      modRole: "GM",
      adminRole: "GA",
      systemNotice: true
    },
    permLevels: [
      { level: 0, name: "Membre", check: () => true},
      {
        level: 1,
        name: "GM",
        check: message => {
          try {
            const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase()
            );
            if (modRole && message.member.roles.has(modRole.id)) return true;
          } catch (e) {
            return false;
          }
        }
      },
      {
        level: 2,
        name: "GA",
        check: message => {
          try {
            const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settongs.adminRole.toLowerCase()
            );
            if (adminRole && message.member.roles.has(adminRole.id)) return true;
          } catch (e) {
            return false;
          }
        } 
      },
      {
        level: 3,
        name: "Owner",
        check: message => message.client.appInfo.owner.id === message.author.id
      }
    ]
  };
}

module.exports = getConfig;