const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Professor = require('../models/professorModel');

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username exists in the database
        const existingProfessor = await Professor.findOne({ userName: username });

        if (!existingProfessor) {
            // If the username doesn't exist, return an error
            req.session.error = 'Username or password is incorrect';
            return res.redirect('/login');
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, existingProfessor.password);

        if (!passwordMatch) {
            // If passwords don't match, return an error
            req.session.error = 'Username or password is incorrect';
            console.log("incorrect uname or password");
            return res.redirect('/login');
        }

        // Passwords match, so login is successful
        // Set session variables to store user data
        req.session.professorName = existingProfessor.professorName;
        req.session.userName = existingProfessor.userName;

        // Redirect to the homepage route
        res.redirect('/homepage');
    } catch (error) {
        // Handle any errors
        console.error('Error logging in:', error);
        req.session.error = 'An error occurred while logging in';
        res.redirect('/login');
    }
});

module.exports = router;
