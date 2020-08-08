const readlineSync = require('readline-sync')
const fs = require('fs')
const config = []

const existingConfig = fs.existsSync(__dirname + "/../config/icons.config.json");
if(existingConfig){
  if(!readlineSync.keyInYN("Istnieje już plik konfiguracyjny, czy chcesz go nadpisać?: ")) {
    process.exit(0);
  }
}

console.log("icons.config.json generator rozpoczął pracę\nJeżeli wartość w nawiasach jest dla ciebie okej to wciśnij ENTER\n\n")

if (readlineSync.keyInYN("Chcesz teraz zacząć wprowadzać ikony?: ")) {
  let next = true, i = 0;
  while (next) {
    const tempConf = {
      icon: null,
      types: []
    }
    tempConf.icon = readlineSync.question("Podaj ID ikony której chcesz użyć");
    let k = 1;
    let type = "";
    while((type = readlineSync.question(`Podaj ${k} typ (aby przerwać kliknij enter): `)) !== "") {
      tempConf.types.push(type);
      k++;
    }
    config.push(tempConf)
    i++;
    if (!readlineSync.keyInYN(`Chcesz podać kolejny(${i + 1}) region?: `)) next = false;
  }
}

fs.writeFileSync(__dirname + "/../config/icons.config.json", JSON.stringify(config, null, 2))
console.log("Plik konfiguracyjny został zapisany!")