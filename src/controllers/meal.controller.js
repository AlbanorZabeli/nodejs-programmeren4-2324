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
        const mealId = parseInt(req.params.mealId, 10);
        logger.trace('delete meal', mealId);
        mealService.delete(mealId, (error, success) => {
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
        logger.trace('update meal', mealId);
    
        mealService.update(mealId, mealData, (error, success) => {
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
                data: success.data
            });
        });
    },
        getProfile: async (req, res, next) => {
        // Assume the token is sent in the Authorization header in the format 'Bearer <token>'
        const token = req.headers.token;
        if (!token) {
            return next({
                status: 401,
                message: 'No token provided',
                data: {}
            });
        }
    
        try{
            // Decode the token using the same secret used to create the token
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    
            // Extract the meal ID from the decoded token
            const mealId = decoded.id;
            logger.info(mealId);
            if(typeof mealId !== 'number'){
                mealId = parseInt(mealId);
            }
    
            // Fetch meal details from the meal service using the extracted ID
            mealService.getById(mealId, (error, success) => {
                if (error) {
                    return next({
                        status: error.status,
                        message: error.message,
                        data: {}
                    });
                }
    
                res.status(200).json({
                    status: 200,
                    message: "Profile fetched successfully",
                    data: success.data
                });
            });
            } catch (error) {
                return next({
                    status: 401,
                    message: 'Invalid or expired token',
                    data: {}
                });
            }
    }
}    


module.exports = mealController