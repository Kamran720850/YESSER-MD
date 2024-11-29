const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0RrSE5sOG5oV3FpSElmRGFTVTZtNVByYXFTcHN2cEJ2aUlHbXM4aitHMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTzFBb0d4NzZYdlRHTUZuZTdaaC9qSkVsbVdncXJVM3BPcDM4ZG1oN3BYWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJTUGpDV21UT0RpWHVHQ1UrSnduNG16NHp1d1p6YjlvYzFJQVZEbmRJNWtnPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDcTMzQWVpTkJ5ZVNIZFVyRGJXV3hyZFRFdVB3aWdlSU12elZJKzZpVkZjPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9PTmxEcTZKN21jcVQvTVU0ZnRVUVZMNVNyMUZJYlA5cS92TVNUcEJ4WHc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFpaGtsZStRcThreDU3MjB2aWxwOFkxSTdlZEhDKzQ1L0dqUnNnYSszU1k9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0R4OWIwS2R3bFJJY0M1QXRqYUpBeW9UUEMxWjVRdEZ5dzMvYktwZzdsZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieGZxcE9DbEpkK0gyNjJnSHZackNQUlE2MTU2YjRUSzYyc2xheW1pYmJqZz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkpISTVwSDdEUms1eW1qY3BFTWVCWEdYbG92UUlON3BFN1VhL1NSb1VOczNwajZ1ZGJ0aDhuWkRZSWxnL2MyQXUrd251eDNMd21FSG10QjhJVFlvY0RRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTM4LCJhZHZTZWNyZXRLZXkiOiJWTkRqNEFWMW1UVlJTZEgzNS9Td25OK1JFTDhmVFBtNVpqRUFqbkI2L0xnPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJZaUNDTjA3VVJVdTdFby15S2IyNkhRIiwicGhvbmVJZCI6ImQ4MTNiN2IxLWM4NjktNGI1Mi04MTdlLWUxZTAyMjBlNTQ4ZCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIyRzJyaTVpVXhGeldvY01SVkh2a29BLzUzYWs9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZTdwb1VUYXZkOWRIS09LTlE3WDZUdVlSdk1nPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjkxNFA0SkxDIiwibWUiOnsiaWQiOiI5MjMyMjUyOTQ2MDU6OUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSUtkcDU0R0VMNldwcm9HR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiL2VWanRkTm5hRFV4YnFTQzFYY0g2Q05vd0Vya2RmWndBaXJPRzVEQ1B4ST0iLCJhY2NvdW50U2lnbmF0dXJlIjoicmRoUG5wcGsrNVBCNUNzREF4V1hxYU1WTTZnbXpPUWs0U1Q2NTNtdTMzMHlCTVdGZ1F3bUpMNzlqYmtBMFZHck5vME9ROUZiOWhPd1N5V0QycUhiQlE9PSIsImRldmljZVNpZ25hdHVyZSI6Im5PS1FDWWNiaGdNMzZUd1lsQW9aS2tvSkFtVi9tcERtZVFla3VaZjNCcitCWVczQnU0UEVGYXZjMlI4cGNza1BHUTBSVHYrSmFLOC83V2laaEM3bkJ3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTIzMjI1Mjk0NjA1OjlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZjNsWTdYVFoyZzFNVzZrZ3RWM0IrZ2phTUJLNUhYMmNBSXF6aHVRd2o4UyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczMjg3MzA0MCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFEMDUifQ==',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "yessertech",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "255621995482",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'Yesser Md ',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/37882de26f9ffc60043ef.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
