const fs = require('fs');

module.exports = {
  development: {
    host: "127.0.0.1",
    port: 5432,
    username: "postgres",
    password: "1111",
    database: "postgres",
    dialect: "postgres",
    "migrationStorageTableName": "migrations",
    dialectOptions: {
      bigNumberStrings: true
    }
  }
};

