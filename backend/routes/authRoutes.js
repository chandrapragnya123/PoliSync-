//This imports the Express framework.
//Express is used to build APIs and web servers in Node.js.
const express = require('express');
//Creates a router instance from Express.
//Think of it as a mini-app that handles a group of routes (like /login and /register) 
// separately from the main app
const router = express.Router();
//This line imports the login and register functions from the authController.js file.
//These functions handle what should happen when a user hits /login or /register.
const { login, register } = require('../controllers/authController');
//Defines a POST route for /login.
//When someone makes a POST request to /login, Express calls the login function to handle it.
router.post('/login', login);
//Defines a POST route for /register.
//When someone makes a POST request to /register, Express calls the register function to handle it.
router.post('/register', register);

module.exports = router;