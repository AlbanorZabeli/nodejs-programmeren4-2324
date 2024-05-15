const database = require('../../DbConnection')
const logger = require('../util/logger')
const jwt = require('jsonwebtoken')
const UserDao = require('../dao/UserDao')
require('dotenv').config
const { JsonWebTokenError } = require('jsonwebtoken')

const userService = {
    create: (user, callback) => {
        logger.info('Creating user', user);
        // Prepare the SQL query to check if the email address already exists
        const query = "SELECT * FROM user WHERE emailAdress = ?";
        const values = [user.emailAdress];

        // Execute the SQL query
        database.query(query, values, (error, results) => {
            if (error) {
                logger.error('Error querying database: ', error.message);
                return callback(error, null);
            }

            // Check if any records are returned
            if (results.length > 0) {
                const errorExists = new Error('A user with the same email adress already exists.');
                logger.error('Error creating user: ', errorExists.message);
                return callback(errorExists, null);
            } else {
                // Proceed with adding the user if the email is not found
                UserDao.add(user, (err, data) => {
                    if (err) {
                        logger.error('Error creating user: ', err.message || 'unknown error');
                        callback(err, null);
                    } else {
                        logger.trace(`User created with id ${data.id}.`);
                        callback(null, {
                            message: `User created with id ${data.id}.`,
                            data: data
                        });
                    }
                });
            }
        });
    },

    getAll: (callback) => {
        logger.info('getAll')

        UserDao.getAll((err, data) => {
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
        UserDao.getById(id, (err, data) => {
            if (!data) {
                logger.info(`User not found with id ${id}`);
                callback(new Error('User not found with id ' + id), null);
                logger.error('error getting user: ', err.message || 'unknown error');
                callback(err, null);
            } else if (err) {
                logger.error('error getting user: ', err.message || 'unknown error');
                callback(err, null);
            } else {
                callback(null, {
                    message: `User found with id ${id}.`,
                    data: data
                });
            }
        });
    },

    delete: (id, callback) => {
        logger.info(`Attempting to delete user with id ${id}`);
    
        // Prepare the SQL query to check if the user exists
        const checkQuery = "SELECT * FROM user WHERE id = ?";
    
        // Execute the SQL query to check existence
        database.query(checkQuery, [id], (checkError, checkResults) => {
            if (checkError) {
                logger.error('Error checking user existence: ', checkError.message);
                return callback(checkError, null);
            }
    
            // If no user exists with the given ID, return an error
            if (checkResults.length === 0) {
                const err = new Error('No existing user was found with id: ' + id);
                logger.error('Error: ', err.message);
                return callback(err, null);
            } else {
                // User exists, proceed with deletion
                const deleteQuery = "DELETE FROM user WHERE id = ?";
                database.query(deleteQuery, [id], (deleteError, deleteResults) => {
                    if (deleteError) {
                        logger.error('Error deleting user: ', deleteError.message);
                        return callback(deleteError, null);
                    }
                    if (deleteResults.affectedRows === 0) {
                        const err = new Error('No existing user was found with id: ' + id);
                        logger.error('Error: ', err.message);
                        return callback(err, null);
                    }
                    // Confirm deletion
                    logger.info(`User with id ${id} deleted successfully.`);
                    callback(null, { message: `User with id ${id} deleted successfully.` });
                });
            }
        });
    },
    
    update: (id, user, callback) => {
        logger.info(`Attempting to update user with id ${id}`, user);
    
        // Prepare SQL query to check if the user exists
        const checkUserExistsQuery = "SELECT * FROM user WHERE id = ?";
        
        database.query(checkUserExistsQuery, [id], (existError, existResults) => {
            if (existError) {
                logger.error('Error checking user existence: ', existError.message);
                return callback(existError, null);
            }
    
            // If no user exists with the given ID, return an error
            if (existResults.length === 0) {
                const err = new Error('No existing user was found with id: ' + id);
                logger.error('Error: ', err.message);
                return callback(err, null);
            }
    
            // Prepare SQL query to check for email uniqueness among other users
            const checkEmailUniqueQuery = "SELECT * FROM user WHERE emailAdress = ? AND id != ?";
            
            database.query(checkEmailUniqueQuery, [user.emailAdress, id], (emailError, emailResults) => {
                if (emailError) {
                    logger.error('Error checking email uniqueness: ', emailError.message);
                    return callback(emailError, null);
                }
    
                if (emailResults.length > 0) {
                    const error = new Error('A user with the same email adress already exists.');
                    logger.error('Error updating user: ', error.message);
                    return callback(error, null);
                }
    
                // Proceed with updating the user if the ID is found and the email is unique
                UserDao.update(id, user, (updateError, updateResults) => {
                    if (updateError) {
                        logger.error('Error updating user: ', updateError.message);
                        return callback(updateError, null);
                    }
    
                    if (updateResults.affectedRows === 0) {
                        const err = new Error('No existing user was updated with id: ' + id);
                        logger.error('Error: ', err.message);
                        return callback(err, null);
                    }
    
                    logger.trace(`User updated with id ${id}.`);
                    callback(null, {
                        message: 'User updated successfully.',
                        data: user
                    });
                });
            });
        });
    },
    

    login: (email, password, callback) => {
        logger.info('Attempting login for', email);
    
        // Prepare SQL query to find the user by email
        const query = "SELECT * FROM user WHERE emailAdress = ?";

            database.query(query, [email], (error, results) => {
                if (error) {
                    logger.error('Error during login attempt: ', error);
                    callback({ status: 500, message: 'Error logging in', data: error });
                    return;
                }
    
                if (results.length === 0) {
                    callback({ status: 404, message: 'User not found' });
                    return;
                }
    
                const user = results[0];
                if (user.password !== password) {
                    callback({ status: 401, message: 'Incorrect password' });
                    return;
                }
    
                // Use JWT to create a token
                const token = jwt.sign(
                    { 
                        id: user.id,
                        emailAdress: user.emailAdress,
                        roles: user.roles // Assuming roles are part of your user schema
                    },
                    process.env.JWT_SECRET, // The secret key for signing the token
                    { expiresIn: '1h' } // Sets the expiration time of the token
                );
                callback(null, {
                    message: 'Login successful',
                    data: { 
                        user: {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            emailAdress: user.emailAdress
                        },
                        token
                    }
                });
            });
    }
}   

module.exports = userService
