module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    await this.client.wait(1000);

    this.client.appInfo = await this.client.fetchApplication();
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    this.client.user.setActivity("Playing ZedouMt2");

    this.client.logger.log(`${this.client.user.tag} est  prêt a espionner ${this.client.users.size} utilisateurs sur ${this.client.channels.size} salons.`, 
      "ready"
    );
  }
};