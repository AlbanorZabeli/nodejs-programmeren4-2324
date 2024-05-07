const database = require('../dao/inmem-db')
const logger = require('../util/logger')

const db = require('../dao/mysql-db')

const userService = {
    create: (user, callback) => {
        logger.info('create user', user)
        database.add(user, (err, data) => {
            if (err) {
                logger.info(
                    'error creating user: ',
                    err.message || 'unknown error'
                )
                callback(err, null)
            } else {
                logger.trace(`User created with id ${data.id}.`)
                callback(null, {
                    message: `User created with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    getAll: (callback) => {
        logger.info('getAll')

        database.getAll((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found ${data.length} users.`,
                    data: data
                })
            }
        })
    },
        
        delete: (id, callback) => {
            logger.info(`delete user with id ${id}`);
            database.delete(id, (err, result) => {
                if (err) {
                    logger.error('error deleting user: ', err.message || 'unknown error');
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            });
        },
    
        update: (id, user, callback) => {
            logger.info(`update user with id ${id}`, user);
            database.update(id, user, (err, data) => {
                if (err) {
                    logger.error('error updating user: ', err.message || 'unknown error');
                    callback(err, null);
                } else {
                    logger.trace(`User updated with id ${id}.`);
                    callback(null, {
                        message: `User updated successfully.`,
                        data: data
                    });
                }
            });
        }
    }

module.exports = userService
