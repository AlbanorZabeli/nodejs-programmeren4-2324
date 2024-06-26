const database = require('../../DbConnection')
const logger = require('../util/logger')
const jwt = require('jsonwebtoken')
const db = require('../dao/mysql-db')
const mealDao = require('../dao/MealDao')
require('dotenv').config
const { JsonWebTokenError } = require('jsonwebtoken')
const MealDao = require('../dao/MealDao')

const mealService = {
    create: (meal, callback) => {
        logger.info('Creating meal', meal);
        // Prepare the SQL query to check if the name address already exists
        const query = "SELECT * FROM meal WHERE name = ?";
        const values = [meal.name];

        // Execute the SQL query
        database.query(query, values, (error, results) => {
            if (error) {
                logger.error('Error querying database: ', error.message);
                return callback(error, null);
            }

            // Check if any records are returned
            if (results.length > 0) {
                const errorExists = new Error('A meal with the same name  already exists.');
                logger.error('Error creating meal: ', errorExists.message);
                return callback(errorExists, null);
            } else {
                // Proceed with adding the meal if the name is not found
                mealDao.add(meal, (err, data) => {
                    if (err) {
                        logger.error('Error creating meal: ', err.message || 'unknown error');
                        callback(err, null);
                    } else {
                        logger.trace(`meal created with id ${data.id}.`);
                        callback(null, {
                            message: `meal created with id ${data.id}.`,
                            data: data
                        });
                    }
                });
            }
        });
    },

    getAll: (callback) => {
        logger.info('getAll')

        mealDao.getAll((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found ${data.length} meals.`,
                    data: data
                })
            }
        })
    },

    getById: (id, callback) => {
        logger.info(`getById with id ${id}`);
        mealDao.getById(id, (err, data) => {
            if (!data) {
                logger.info(`meal not found with id ${id}`);
                callback(new Error('meal not found with id ' + id), null);
                logger.error('error getting meal: ', err.message || 'unknown error');
                callback(err, null);
            } else if (err) {
                logger.error('error getting meal: ', err.message || 'unknown error');
                callback(err, null);
            } else {
                callback(null, {
                    message: `meal found with id ${id}.`,
                    data: data
                });
            }
        });
    },

    delete: (id, callback) => {
        logger.info(`Attempting to delete meal with id ${id}`);
    
        // Prepare the SQL query to check if the meal exists
        const checkQuery = "SELECT * FROM meal WHERE id = ?";
    
        // Execute the SQL query to check existence
        database.query(checkQuery, [id], (checkError, checkResults) => {
            if (checkError) {
                logger.error('Error checking meal existence: ', checkError.message);
                return callback(checkError, null);
            }
    
            // If no meal exists with the given ID, return an error
            if (checkResults.length === 0) {
                const err = new Error('No existing meal was found with id: ' + id);
                logger.error('Error: ', err.message);
                return callback(err, null);
            } else {
                // meal exists, proceed with deletion
                const deleteQuery = "DELETE FROM meal WHERE id = ?";
                database.query(deleteQuery, [id], (deleteError, deleteResults) => {
                    if (deleteError) {
                        logger.error('Error deleting meal: ', deleteError.message);
                        return callback(deleteError, null);
                    }
                    if (deleteResults.affectedRows === 0) {
                        const err = new Error('No existing meal was found with id: ' + id);
                        logger.error('Error: ', err.message);
                        return callback(err, null);
                    }
                    // Confirm deletion
                    logger.info(`meal with id ${id} deleted successfully.`);
                    callback(null, { message: `meal with id ${id} deleted successfully.` });
                });
            }
        });
    },
    
    update: (id, meal, callback) => {
        logger.info(`Attempting to update meal with id ${id}`, meal);
    
        // Prepare SQL query to check if the meal exists
        const checkMealExistsQuery = "SELECT * FROM meal WHERE id = ?";
        database.query(checkMealExistsQuery, [id], (existError, existResults) => {
            if (existError) {
                logger.error('Error checking meal existence: ', existError.message);
                return callback({ status: 500, message: 'Database error: ' + existError.message });
            }
    
            // If no meal exists with the given ID, return an error
            if (existResults.length === 0) {
                const err = { status: 404, message: 'No existing meal was found with id: ' + id };
                logger.error('Error: ', err.message);
                return callback(err, null);
            }
    
            // Prepare SQL query to check for name uniqueness among other meals
            const checkNameUniqueQuery = "SELECT * FROM meal WHERE name = ? AND id != ?";
            database.query(checkNameUniqueQuery, [meal.name, id], (nameError, nameResults) => {
                if (nameError) {
                    logger.error('Error checking name uniqueness: ', nameError.message);
                    return callback({ status: 500, message: 'Database error: ' + nameError.message });
                }
    
                if (nameResults.length > 0) {
                    const error = { status: 400, message: 'A meal with the same name already exists.' };
                    logger.error('Error updating meal: ', error.message);
                    return callback(error, null);
                }
    
                // Prepare SQL query to update the meal
                const updateMealQuery = "UPDATE meal SET ? WHERE id = ?";
                database.query(updateMealQuery, [meal, id], (updateError, updateResults) => {
                    if (updateError) {
                        logger.error('Error updating meal: ', updateError.message);
                        return callback({ status: 500, message: 'Database error: ' + updateError.message });
                    }
    
                    if (updateResults.affectedRows === 0) {
                        const err = { status: 404, message: 'No existing meal was updated with id: ' + id };
                        logger.error('Error: ', err.message);
                        return callback(err, null);
                    }
    
                    logger.trace(`Meal updated with id ${id}.`);
                    callback(null, {
                        message: 'Meal updated successfully.',
                        data: meal
                    });
                });
            });
        });
    }
}   

module.exports = mealService
