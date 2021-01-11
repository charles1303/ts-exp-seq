"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";

var dbConfig = {
  "username": process.env.DB_USER || '',
  "password": process.env.DB_PWD || '',
  "database": process.env.DB_NAME || 'my-db',
  "host": process.env.DB_HOST || 'localhost',
  "port": Number.isInteger(process.env.DB_PORT) ? parseInt(process.env.DB_PORT) : 3306,
  "dialect": process.env.DB_DIALECT || 'sqlite',
  "pool": {
    "max": Number.isInteger(process.env.MAX_POOL) ? parseInt(process.env.MAX_POOL) : 5,
    "min": Number.isInteger(process.env.MIN_POOL) ? parseInt(process.env.MIN_POOL) : 0,
    "acquire": Number.isInteger(process.env.ACQUIRE) ? parseInt(process.env.ACQUIRE) : 30000,
    "idle": Number.isInteger(process.env.IDLE) ? parseInt(process.env.IDLE) : 10000
  }
}
var db = {};
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: false,
  ...(env === "staging" && {
    dialectOptions: {
      ssl: {
        cert: fs.readFileSync(
          __dirname + "/../configs/BaltimoreCyberTrustRoot.crt.pem"
        ),
      },
    },
  }),
});


fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function (file) {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync({force: process.env.CREATE_AND_DROP_DB_TABLES == "true"})
    .catch(_err => {
      console.log(`Error syncing!`+ err)
    });

module.exports = db;
