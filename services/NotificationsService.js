const fs = require('fs');
const {exec} = require('child_process')
const _ = require('lodash')
const {notificationsConfigValidation} = require('../validation');
const formurlencoded = require('form-urlencoded').default;


class NotifiactionsService {
  isConfigured = false;
  constructor() {
    try {
      const rawNotif = fs.readFileSync(__dirname + "/../config/notifications.config.json");
      this.config = JSON.parse(rawNotif);
      if(notificationsConfigValidation.validate(this.config).error){
        console.log(notificationsConfigValidation.validate(this.config).error)
        throw Error()
      }
      this.isConfigured = true;
    } catch {
      console.log("Wystąpił błąd z plikiem konfiguracyjnym powiadomień, powiadomienia nie zostaną wysłane")
      //error ignored
    }
    this.messages = {
      Expo: {},
      Pushover: {},
    };
  }
  createExpoNotification(device, body, title) {
    if(!this.messages.Expo[device.when]) this.messages.Expo[device.when] = []
    this.messages.Expo[device.when].push({
      to: this.config[device.name].tokenExpo,
      title: `KiedyŚmieci - ${title}`,
      body,
      sound: "default",
      priority: "high"
    })
  }
  createPushoverNotification(device, body, title) {
    if(!this.messages.Pushover[device.when]) this.messages.Pushover[device.when] = []
    this.messages.Pushover[device.when].push({
      token: this.config[device.name].tokenPushover,
      user: this.config[device.name].user,
      title: `KiedyŚmieci - ${title}`,
      message: body,
      device: this.config[device.name].device,
      priority: 1
    })
  }
  createNotification(device, body, title) {
    if(!this.isConfigured || !this.config.hasOwnProperty(device.name)) return
    const provider = this.config[device.name].provider;
    if(provider === "Expo") {
      this.createExpoNotification(device, body, title);
    }
    else if(provider === "Pushover"){
      this.createPushoverNotification(device, body, title);
    }
  }
  setExpoPushNotifications(messages) {
    _.mapKeys(messages, (message, time) => {
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
  setPushoverPushNotifications(messages) {
    _.mapKeys(messages, (message, time) => {
      message.map(msg => {
        const curlString = `curl -XPOST -d "${formurlencoded(msg)}" -H "Content-Type: application/x-www-form-urlencoded" https://api.pushover.net/1/messages.json`
        const execString = `echo '${curlString}' | at ${time}`
        exec(execString, (error) => {
          if(error){
            console.log("Wystąpił błąd podczas ustawiania powiadomień", error.message)
            return
          }
          console.log("Powiadomienia ustawione");
        })
      })
    })
  }
  setPushNotifications() {
    if(_.isEmpty(this.messages)) return;
    if(!_.isEmpty(this.messages.Expo)){
      this.setExpoPushNotifications(this.messages.Expo);
    }
    if(!_.isEmpty(this.messages.Pushover)) {
      this.setPushoverPushNotifications(this.messages.Pushover)
    }
  }
}

module.exports = new NotifiactionsService();