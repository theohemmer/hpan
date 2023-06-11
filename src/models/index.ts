import { Sequelize } from 'sequelize-typescript';
import * as db_config from "../database_configs/db_config";
import Todo from './todo';
import User from './user';

const db = new Sequelize({
    host: db_config[process.env.NODE_ENV].host,
    port: db_config[process.env.NODE_ENV].port,
    database: db_config[process.env.NODE_ENV].database,
    username: db_config[process.env.NODE_ENV].username,
    password: db_config[process.env.NODE_ENV].password,
    dialect: "mysql",
    logging: process.env.NODE_ENV != "test" ? false : console.log,
    models: [
        Todo,
        User
    ]
});

export default db;