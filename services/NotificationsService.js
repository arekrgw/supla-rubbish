const fs = require('fs');
const {exec} = require('child_process')
const _ = require('lodash')
const {notificationsConfigValidation} = require('../validation');


class NotifiactionsService {
  isConfigured = false;
  constructor() {
    try {
      const rawNotif = fs.readFileSync(__dirname + "/../config/notifications.config.json");
      this.config = JSON.parse(rawNotif);
      if(notificationsConfigValidation.validate(this.config).error){
        throw Error()
      }
      this.isConfigured = true;
    } catch {
      console.log("Wystąpił błąd z plikiem konfiguracyjnym powiadomień, powiadomienia nie zostaną wysłane")
      //error ignored
    }
    this.messages = {};
  }
  appendMessage(to, title, body) {
    this.messages.push({
      to,
      title: `KiedyŚmieci - ${title}`,
      body,
      sound: "default",
      priority: "high"
    })
  }
  createNotification(device, body, title) {
    if(!this.isConfigured || !this.config.hasOwnProperty(device.name)) return
    if(!this.messages[device.when]) this.messages[device.when] = []
    this.messages[device.when].push({
      to: this.config[device.name].token,
      title: `KiedyŚmieci - ${title}`,
      body,
      sound: "default",
      priority: "high"
    })
  }
  setPushNotifications() {
    if(_.isEmpty(this.messages)) return
    _.mapKeys(this.messages, (message, time) => {
      const curlString = `curl -XPOST -d "${JSON.stringify(message).replace(/"/g, '\\"')}" -H "Accept: application/json" -H "Content-Type: application/json" -H "Accept-Encoding: gzip, deflate" https://exp.host/--/api/v2/push/send`
      const execString = `echo '${curlString}' | at ${time}`
      exec(execString, (error) => {
        if(error){
          console.log("Wystąpił błąd podczas ustawiania powiadomień", error.message)
          return
        }
        console.log("Powiadomienia ustawione");
      })
    })
  }
}

module.exports = new NotifiactionsService();