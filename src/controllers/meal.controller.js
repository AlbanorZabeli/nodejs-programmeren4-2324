const { JsonWebTokenError } = require('jsonwebtoken')
const mealService = require('../services/meal.service')
const logger = require('../util/logger')
const jwt = require('jsonwebtoken')

let mealController = {
    create: (req, res, next) => {
        const meal = req.body
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Extract the user ID from the decoded token
        let cookId = decoded.id;
        logger.info(cookId);


        logger.info('create meal', meal.name, meal.id)
        mealService.create(meal, cookId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAll: (req, res, next) => {
        logger.trace('getAll')
        mealService.getAll((error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getById: (req, res, next) => {
        const mealId = req.params.mealId
        logger.trace('mealController: getById', mealId)
        mealService.getById(mealId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    // Todo: Implement the update and delete methods
    delete: (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Extract the user ID from the decoded token
        let cookId = decoded.id;
        logger.info(cookId);
        const mealId = parseInt(req.params.mealId, 10);
        logger.trace('delete meal', mealId);
        mealService.delete(mealId, cookId, (error, success) => {
            if (error) {
                return next({
                    status: error.status || 500,
                    message: error.message,
                    data: {}
                });
            }
            res.status(200).json({
                status: 200,
                message: success.message,
                data: {}
            });
        });
    },

        update: (req, res, next) => {
        const mealId = parseInt(req.params.mealId, 10);
        const mealData = req.body;
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
        if (!token) {
            return next({
                status: 401,
                message: 'No token provided',
                data: {}
            });
        }
    
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next({
                    status: 401,
                    message: 'Invalid or expired token',
                    data: {}
                });
            }
    
            const userId = decoded.id; // Assuming the user ID is stored in the token
    
            mealService.getById(mealId, (error, meal) => {
                if (error) {
                    return next({
                        status: error.status || 500,
                        message: error.message,
                        data: {}
                    });
                }
    
                if (meal.userId !== userId) {
                    return next({
                        status: 403,
                        message: 'Forbidden: You can only update your own meals',
                        data: {}
                    });
                }
    
                mealService.update(mealId, mealData, (updateError, success) => {
                    if (updateError) {
                        return next({
                            status: updateError.status || 500,
                            message: updateError.message,
                            data: {}
                        });
                    }
                    res.status(200).json({
                        status: 200,
                        message: success.message,
                        data: success.data
                    });
                });
            });
        });
}
}


module.exports = mealController