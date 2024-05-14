const { JsonWebTokenError } = require('jsonwebtoken')
const userService = require('../services/user.service')
const logger = require('../util/logger')
const jwt = require('jsonwebtoken')

let userController = {
    create: (req, res, next) => {
        const user = req.body
        logger.info('create user', user.firstName, user.lastName)
        userService.create(user, (error, success) => {
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
        userService.getAll((error, success) => {
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
        const userId = req.params.userId
        logger.trace('userController: getById', userId)
        userService.getById(userId, (error, success) => {
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
        const userId = parseInt(req.params.userId, 10);
        logger.trace('delete user', userId);
        userService.delete(userId, (error, success) => {
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
        const userId = parseInt(req.params.userId, 10);
        const userData = req.body;
        logger.trace('update user', userId);
        userService.update(userId, userData, (error, success) => {
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

    login: async (req, res, next) => {
        const { emailAdress, password } = req.body;
        logger.info('Login attempt by', emailAdress);
    
        await userService.login(emailAdress, password, (error, success) => {
            if (error) {
                return next({
                    status: error.status || 500,
                    message: error.message,
                    data: {}
                });
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                });
            }
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
    
            // Extract the user ID from the decoded token
            const userId = decoded.id;
            logger.info(userId);
            if(typeof userId !== 'number'){
                userId = parseInt(userId);
            }
    
            // Fetch user details from the user service using the extracted ID
            userService.getById(userId, (error, success) => {
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


module.exports = userController