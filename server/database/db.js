import client from './connection';

const createTables = () => {
  const tables = `
  DROP TABLE IF EXISTS users CASCADE;
  DROP TABLE IF EXISTS accounts CASCADE;
  DROP TABLE IF EXISTS transactions CASCADE;
  CREATE TABLE users(
    "id" UUID NOT NULL PRIMARY KEY,
    "email" VARCHAR NOT NULL UNIQUE,
    "firstName" VARCHAR NOT NULL,
    "lastName" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "isAdmin" BOOLEAN
  );
  CREATE TABLE products(
    "id" UUID NOT NULL PRIMARY KEY,
    "name" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "price" FLOAT NOT NULL,
    "status" TEXT NOT NULL
  );
  CREATE TABLE cart(
    "id" UUID NOT NULL PRIMARY KEY,
    "name" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "quantity" BIGINT NOT NULL,
    "price" FLOAT NOT NULL
  );
  `;

  return client
    .query(tables)
    .then(res => {
      console.log('All tables were created successfully!');
      return process.exit();
    })
    .catch(err => {
      console.log('Error occured while creating the tables: ', err);
      client.end();
      return process.exit();
    });
};

export default createTables();