const Axios = require('axios')

class NotifiactionsService {
  constructor() {
    this.messages = [];
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
  sendPushNotifications() {
    if(this.messages.length){
      Axios.post(
        `https://exp.host/--/api/v2/push/send`,
        this.messages,
        {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip, deflate"
        }
      )
      console.log(`Wysyłam ${this.messages.length} powiadomienia`)
    }
  }
}

module.exports = new NotifiactionsService();