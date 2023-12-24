const fs = require('fs');
const path = require('path');

function loadConfigFromFile() {
  const configPath = path.join(__dirname, 'config.json');
  const configFile = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(configFile);
}

if (process.env.JWT_SECRET && process.env.MYSQL_ROOT_PASSWORD && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD && process.env.MYSQL_DATABASE) {
  global.PORT = 3000;
  global.JWT_SECRET = process.env.JWT_SECRET;
  global.MYSQL_HOST = "mysql";
  global.MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD;
  global.MYSQL_USER = process.env.MYSQL_USER;
  global.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
  global.MYSQL_DATABASE = process.env.MYSQL_DATABASE;

  console.log("Using production setting.")
} else {
  const config = loadConfigFromFile();

  global.PORT = 3001;
  global.JWT_SECRET = config.JWT_SECRET;
  global.MYSQL_HOST = "localhost";
  global.MYSQL_ROOT_PASSWORD = config.MYSQL_ROOT_PASSWORD;
  global.MYSQL_USER = config.MYSQL_USER;
  global.MYSQL_PASSWORD = config.MYSQL_PASSWORD;
  global.MYSQL_DATABASE = config.MYSQL_DATABASE;

  console.log("Using development setting.")
}

