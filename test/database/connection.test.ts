//import db from '../../src/configs/database_t';
//import { database } from '../../src/configs/database_t';
const database = require('../../src/models').db;

describe('Database', () => {
  test.skip('Test connection', async () => {
    await database.sequelize.authenticate()

    await database.sequelize.sync({force: true})
    .then(() => {
      console.log(`Database & tables created!`)
    })
    .catch(err => {
      console.log(`Error syncing!`+ err)
    })
  });
});
