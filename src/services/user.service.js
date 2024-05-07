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

    getById: (id, callback) => {
        logger.info(`getById with id ${id}`);
        database.getById(id, (err, data) => {
            if (err) {
                logger.error('error getting user: ', err.message || 'unknown error');
                callback(err, null);
            } else if (!data) {
                logger.info(`User not found with id ${id}`);
                callback(new Error('User not found'), null);
            } else {
                callback(null, {
                    message: `User found with id ${id}.`,
                    data: data
                });
            }
        });
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
        logger.info(`Attempting to update user with id ${id}`, user);

        if (database._data.find(u => u.email === u.emailAdress)) {
            const error = new Error('A user with the same email address already exists.');
            logger.error('Error updating user: ', error.message);
            return callback(error, null);
        } else {
        database.update(id, user, (err, data) => {
            if (err) {
                logger.error('Error updating user: ', err.message || 'unknown error');
                callback(err, null);
            }
            else {
                logger.trace(`User updated with id ${id}.`);
                callback(null, {
                    message: `User updated successfully.`,
                    data: data
                });
            }
        })};
    }
    
}

module.exports = userService
