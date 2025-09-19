"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.production = exports.test = exports.development = void 0;
var development = {
    username: "root",
    password: "root",
    database: "published_users",
    host: '127.0.0.1',
    dialect: 'mysql',
};
exports.development = development;
var test = {
    username: "root",
    password: "root",
    database: "published_users",
    host: '127.0.0.1',
    dialect: 'mysql',
};
exports.test = test;
var production = {
    username: "root",
    password: "root",
    database: "published_users",
    host: '127.0.0.1',
    dialect: 'mysql',
};
exports.production = production;
