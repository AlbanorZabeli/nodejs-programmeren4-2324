const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const jwt = require('jsonwebtoken')
const router = express.Router()
const userController = require('../controllers/user.controller')
const logger = require('../util/logger')
const database = require('../../DbConnection')
const { error } = require('console')

// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

// Input validation functions for user routes
const validateUserCreate = (req, res, next) => {
    if (!req.body.emailAdress || !req.body.firstName || !req.body.lastName) {
        next({
            status: 400,
            message: 'Missing email or password',
            data: {}
        })
    }
    next()
}

// Input validation function 2 met gebruik van assert
const validateUserCreateAssert = (req, res, next) => {
    try {
        assert(req.body.emailAdress, 'Missing email')
        assert(req.body.firstName, 'Missing or incorrect first name')
        assert(req.body.lastName, 'Missing last name')
        next()
    } catch (ex) {
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// Input validation function 2 met gebruik van assert
const validateUserCreateChaiShould = (req, res, next) => {
    try {
        req.body.firstName.should.not.be.empty.and.a('string')
        req.body.lastName.should.not.be.empty.and.a('string')
        req.body.emailAdress.should.not.be.empty.and.a('string').and.match(/@/)
        next()
    } catch (ex) {
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

const validateUserCreateChaiExpect = (req, res, next) => {
    try {
        assert(req.body.firstName, 'Missing or incorrect firstName field')
        chai.expect(req.body.firstName).to.not.be.empty
        chai.expect(req.body.firstName).to.be.a('string')
        chai.expect(req.body.firstName).to.match(
            /^[a-zA-Z]+$/,
            'firstName must be a string'
        )
        logger.trace('User successfully validated')
        next()
    } catch (ex) {
        logger.trace('User validation failed:', ex.message)
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}


const validateLogin = (req, res, next) => {
    const { emailAdress, password } = req.body;
    if (!emailAdress || !password) {
        next({
            status: 400,
            message: 'Email and password are required',
            data: {}
        });
    } else {
        next();
    }
}

const validateToken = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next({
            status: 401,
            message: 'No token provided or invalid token format',
            data: {}
        });
    }

    // Get the token from the header
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next({
                status: 401,
                message: 'Invalid or expired token',
                data: {}
            });
        }

        // Token is valid, attach the decoded payload to the request object
        req.user = decoded;
        next();
    });
};






router.post('/api/login', validateLogin, userController.login);
router.get('/api/user/profile', validateToken, userController.getProfile);
router.post('/api/user', validateUserCreateChaiExpect, userController.create);
router.get('/api/user', validateToken, userController.getAll);
router.get('/api/user/:userId', validateToken, userController.getById);
router.put('/api/user/:userId', validateToken, userController.update);
router.delete('/api/user', validateToken, userController.delete);

module.exports = router
