const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Professor = require('../models/professorModel');

router.post('/', async (req, res) => {
    const { professorName, userName, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new Professor document
        const professor = new Professor({
            professorName,
            userName,
            password: hashedPassword, // Storing the hashed password
            classes: [] // Initializing with an empty array of classes
        });

        // Save the new Professor document to the database
        await professor.save();

        // Redirect to login page after successful signup
        res.render('login');
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).send('Error signing up professor');
    }
});

module.exports = router;
