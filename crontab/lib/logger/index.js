/**
 * @author synder
 * @time 15/9/2
 * @desc
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

const WinstonLogger = function (options) {

    this.__config = options;

    if (!this.__config) {
        throw new Error('there is no config');
    }

    this.__type = options.type;

    this.__logger = null;

    this.logLevels = {
        levels: {
            debug: 5,
            trace: 4,
            info: 3,
            warn: 2,
            error: 1,
            fatal: 0
        },

        colors: {
            debug: 'black',
            trace: 'black',
            info: 'green',
            warn: 'yellow',
            error: 'red',
            fatal: 'red'
        }
    };

    this.__init();

    return this.__logger;
};

WinstonLogger.prototype.__init = function () {

    const self = this;

    winston.addColors(self.logLevels.colors);

    self.__logger = new (winston.Logger)({levels: self.logLevels.levels});

    let types = self.__type.split('&');

    types = types.map(function (item) {
        return item.trim().toLowerCase();
    });

    types.forEach(function (item) {

        switch (item) {
            case 'console' :
            {
                if (!self.__config.console) {
                    throw new Error('there is no log.console config');
                }

                self.__logger.add(winston.transports.Console, {
                    level: self.__config.console.level,
                    colorize: true
                });
            }
                break;

            case 'file' :
            {
                if (!self.__config.file) {
                    throw new Error('there is no log.console config');
                }

                if (!fs.existsSync(self.__config.file.path)) {
                    fs.mkdirSync(self.__config.file.path);
                }

                let filePath = path.join(self.__config.file.path, self.__config.file.filename);

                self.__logger.add(winston.transports.File, {
                    level: self.__config.file.level,
                    path: self.__config.file.path,
                    filename: filePath,
                    maxsize: self.__config.file.maxsize
                });
            }
                break;

            case 'mongodb':
            {

                let config = self.__config.mongodb;

                if (!config) {
                    throw new Error('there is no log.console config');
                }

                let Mongodb = require('winston-mongodb').MongoDB;

                let db = 'mongodb://';

                if (config.username) {
                    db += config.username + ':' + config.password + '@';
                }

                db += config.host + ':' + config.port + '/' + config.database;

                self.__logger.add(Mongodb, {
                    level: config.level,
                    db: db,
                    capped: config.capped,
                    maxsize: config.maxsize,
                    collection: config.collection
                });

            }
                break;

            case 'email':
            {
                if (!self.__config.email) {
                    throw new Error('there is no log.console config');
                }

                let Mail = require('winston-mail').Mail;

                self.__logger.add(Mail, {
                    level: self.__config.email.level,
                    to: self.__config.email.to,
                    from: self.__config.email.from,
                    host: self.__config.email.host,
                    port: self.__config.email.port,
                    username: self.__config.email.username,
                    password: self.__config.email.password,
                    ssl: self.__config.email.ssl
                });

            }
                break;

            default :
            {
                throw new Error('not support this type ' + item + 'support type list is : console file mongodb email');
            }
                break;
        }

    });
};


module.exports = WinstonLogger;