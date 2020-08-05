# SUPLA-Rubbish v2.0.0

Skrypt podmieniający w chmurze SUPLI nazwę kanału oraz ikonę, na odpowiednią datę oraz typ najbliszych wyworzonych śmieci

# INSTALACJA

```shell
1. git clone https://github.com/arekrgw/supla-rubbish.git
2. cd supla-rubbish
3. npm install
4. npm run gen:supla
5. npm run gen:icons
```
Aby odpalić skrypt wystarczy wpisać: `npm start` lub `node index.js`

# AKTUALIZACJA

W aktualizacji do 2.0.0 zmieniła się struktura pliku konfiguracyjnego `supla.config.json`. Od teraz mozna dodać wiele regionów do jednego skryptu i mozna edytować kanały z róznych kont chmury SUPLA.

***PRZED UPDATEM DO NOWEJ WERSJI, SKOPIUJ SWOJE PLIKI KONFIGURACYJNE!***

### KROKI DO AKTUALIZACJI DO v2.0.0
```
1. cd supla-rubbish
2. git pull origin master --force
3. npm install
4. npm run gen:supla
5. npm run gen:icons
```


Na forum SUPLA.org jest wątek poświęcony temu skryptowi oraz serwerowi KiedyŚmieciv2 https://forum.supla.org/viewtopic.php?f=11&t=6861