import { Dialect } from 'sequelize';

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}

const development: DBConfig = {
  username: "root",
  password: "root",
  database: "published_users",
  host: '127.0.0.1',
  dialect: 'mysql',
};

const test: DBConfig = {
  username: "root",
  password: "root",
  database: "published_users",
  host: '127.0.0.1',
  dialect: 'mysql',
};

const production: DBConfig = {
  username: "root",
  password: "root",
  database: "published_users",
  host: '127.0.0.1',
  dialect: 'mysql',
};

export { development, test, production };
