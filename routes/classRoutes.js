const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const xlsx = require('xlsx'); // For parsing Excel files
const methodOverride = require('method-override');
const Class = require('../models/classModel');
const Student = require('../models/studentModel');
const Professor = require('../models/professorModel');

router.use(methodOverride('_method'));

// Set up multer storage for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle adding a class
router.post('/addClass', upload.single('excelFile'), async (req, res) => {
    try {
        // Extract className from the request body
        const { professorUserName, className } = req.body;

        // Check if the uploaded file exists
        if (!req.file) {
            return res.status(400).send('Please upload an Excel file');
        }

        // Parse the uploaded Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet);

        const studentIds = [];

        // Iterate over each row in the Excel file
        for (const row of data) {
            // Extract student details from the row
            const rollNo = row['Roll No']; // Accessing the 'Roll No' column
            const usn = row['USN']; // Accessing the 'USN' column
            const name = row['Name']; // Accessing the 'Name' column

            // Create a new student document
            const student = new Student({
                rollNo,
                usn,
                name,
                userName: professorUserName, // Assuming email format for username
                className,
                event1: [],
                event2: [],
                event3: [],
                event4: [],
                event5: []
            });

            // Save the student document to the database
            const savedStudent = await student.save();
            
            // Push the ID of the saved student into the studentIds array
            studentIds.push(savedStudent._id);
        }

        // Create a new class document
        const newClass = new Class({
            professorUserName,
            className,
            students: studentIds
        });

        // Save the class document to the database
        await newClass.save();

        // Get the professor document and update its class array
        const professor = await Professor.findOne({ userName: professorUserName });
        professor.class.push(newClass._id);
        await professor.save();

        // Redirect to the homepage with a success message
        res.redirect('/homepage');
    } catch (error) {
        console.error('Error adding class:', error);
        res.status(500).send('Error adding class');
    }
});

// Route to delete a class and its associated students
router.post('/deleteClass', async (req, res) => {
    try {
        // Extract professorUserName and className from request body
        const { professorUserName, className } = req.body;

        // Retrieve the class document
        const classDoc = await Class.findOne({ professorUserName, className });

        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Extract student IDs associated with the class
        const studentIds = classDoc.students;

        // Delete students associated with the class
        await Student.deleteMany({ _id: { $in: studentIds } });

        // Delete the class document
        await Class.findOneAndDelete({ professorUserName, className });

        // Remove class reference from professor document
        await Professor.updateOne(
            { userName: professorUserName },
            { $pull: { class: classDoc._id } }
        );

        res.json({success:true});
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Routes to add questions for each event
router.post('/event1/addQuestion', async (req, res) => {
    try {
        // Retrieve professor username and class name from session
        const professorUserName = req.session.userName;
        const className = req.session.className;

        // Find the class document
        const classDoc = await Class.findOne({ professorUserName, className });

        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Get the students associated with the class
        const studentIds = classDoc.students;

        // Iterate through each student and add the question
        for (const studentId of studentIds) {
            // Find the student document by id
            const student = await Student.findById(studentId);

            if (!student) {
                console.error(`Student not found with id: ${studentId}`);
                continue; // Move to the next student if not found
            }

            // Add the question to the student's event1 array
            student.event1.push({ 
                questionNumber: student.event1.length + 1, 
                coMapped: req.body.co, 
                marksObtained: 0,
                maxMarks: req.body.maxmarks
            });
            const coField = `scores.maxco${req.body.co}`; // to update the maxco(number) marks defined in 'score' in student
            student.set(coField, student.scores[`maxco${req.body.co}`] + parseInt(req.body.maxmarks, 10));
            await student.save();
        }

        res.json({success: true});
        //location.reload();
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ message: 'Error adding question' });
    }
});

router.post('/event2/addQuestion', async (req, res) => {
    try {
        // Retrieve professor username and class name from session
        const professorUserName = req.session.userName;
        const className = req.session.className;

        // Find the class document
        const classDoc = await Class.findOne({ professorUserName, className });

        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Get the students associated with the class
        const studentIds = classDoc.students;

        // Iterate through each student and add the question
        for (const studentId of studentIds) {
            // Find the student document by id
            const student = await Student.findById(studentId);

            if (!student) {
                console.error(`Student not found with id: ${studentId}`);
                continue; // Move to the next student if not found
            }

            // Add the question to the student's event2 array
            student.event2.push({ 
                questionNumber: student.event2.length + 1, 
                coMapped: req.body.co, 
                marksObtained: 0,
                maxMarks: req.body.maxmarks
            });
            const coField = `scores.maxco${req.body.co}`; // to update the maxco(number) marks defined in 'score' in student
            student.set(coField, student.scores[`maxco${req.body.co}`] + parseInt(req.body.maxmarks, 10));
            await student.save();
        }

        res.json({success: true});
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ message: 'Error adding question' });
    }
});

router.post('/event3/addQuestion', async (req, res) => {
    try {
        // Retrieve professor username and class name from session
        const professorUserName = req.session.userName;
        const className = req.session.className;

        // Find the class document
        const classDoc = await Class.findOne({ professorUserName, className });

        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Get the students associated with the class
        const studentIds = classDoc.students;

        // Iterate through each student and add the question
        for (const studentId of studentIds) {
            // Find the student document by id
            const student = await Student.findById(studentId);

            if (!student) {
                console.error(`Student not found with id: ${studentId}`);
                continue; // Move to the next student if not found
            }

            // Add the question to the student's event3 array
            student.event3.push({ 
                questionNumber: student.event3.length + 1, 
                coMapped: req.body.co, 
                marksObtained: 0,
                maxMarks: req.body.maxmarks
            });
            const coField = `scores.maxco${req.body.co}`; // to update the maxco(number) marks defined in 'score' in student
            student.set(coField, student.scores[`maxco${req.body.co}`] + parseInt(req.body.maxmarks, 10));
            await student.save();
        }

        res.json({success: true});
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ message: 'Error adding question' });
    }
});

router.post('/event4/addQuestion', async (req, res) => {
    try {
        // Retrieve professor username and class name from session
        const professorUserName = req.session.userName;
        const className = req.session.className;

        // Find the class document
        const classDoc = await Class.findOne({ professorUserName, className });

        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Get the students associated with the class
        const studentIds = classDoc.students;

        // Iterate through each student and add the question
        for (const studentId of studentIds) {
            // Find the student document by id
            const student = await Student.findById(studentId);

            if (!student) {
                console.error(`Student not found with id: ${studentId}`);
                continue; // Move to the next student if not found
            }

            // Add the question to the student's event4 array
            student.event4.push({ 
                questionNumber: student.event4.length + 1, 
                coMapped: req.body.co, 
                marksObtained: 0,
                maxMarks: req.body.maxmarks
            });
            const coField = `scores.maxco${req.body.co}`; // to update the maxco(number) marks defined in 'score' in student
            student.set(coField, student.scores[`maxco${req.body.co}`] + parseInt(req.body.maxmarks, 10));
            await student.save();
        }

        res.json({success: true});
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ message: 'Error adding question' });
    }
});

router.post('/event5/addQuestion', async (req, res) => {
    try {
        // Retrieve professor username and class name from session
        const professorUserName = req.session.userName;
        const className = req.session.className;

        // Find the class document
        const classDoc = await Class.findOne({ professorUserName, className });

        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Get the students associated with the class
        const studentIds = classDoc.students;

        // Iterate through each student and add the question
        for (const studentId of studentIds) {
            // Find the student document by id
            const student = await Student.findById(studentId);

            if (!student) {
                console.error(`Student not found with id: ${studentId}`);
                continue; // Move to the next student if not found
            }

            // Add the question to the student's event5 array
            student.event5.push({ 
                questionNumber: student.event5.length + 1, 
                coMapped: req.body.co, 
                marksObtained: 0,
                maxMarks: req.body.maxmarks
            });
            const coField = `scores.maxco${req.body.co}`; // to update the maxco(number) marks defined in 'score' in student
            student.set(coField, student.scores[`maxco${req.body.co}`] + parseInt(req.body.maxmarks, 10));
            await student.save();
        }

        res.json({success: true});
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ message: 'Error adding question' });
    }
});



// Route to handle adding marks
router.post('/event1/addMarks', async (req, res) => {
    try {
        // Extract student ID, question number, and marks obtained from the request body
        const { studentId, questionNumber, marks } = req.body;

        // Find the student document by ID
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the index of the question in the event1 array
        const eventIndex = questionNumber - 1;

        // Check if the calculated index is out of bounds
        if (eventIndex < 0 || eventIndex >= student.event1.length) {
            return res.status(404).json({ message: 'Question not found for the student' });
        }

        // Subtract the previous marks from the corresponding CO in the scores object
        const coMapped = student.event1[eventIndex].coMapped;

        // Logging values to debug
        console.log(`Updating marks for Student: ${student.name}, CO Mapped: ${coMapped}`);
        console.log(`Current Scores: ${JSON.stringify(student.scores)}`);

        // Get the maxMarks for the question
        const maxMarks = student.event1[eventIndex].maxMarks;

        // Previous marks
        const prevMarks = student.event1[eventIndex].marksObtained;

        // Check if coMapped is within valid range (1-5)
        if (coMapped >= 1 && coMapped <= 5) {
            const coKey = `co${coMapped}`;
            console.log(`CO Key: ${coKey}`);
            
            // Adjust the scores for the mapped CO
            if (student.scores[coKey] !== undefined) {
                student.scores[coKey] += (marks - prevMarks);
                console.log(`Updated Scores: ${JSON.stringify(student.scores)}`);
            } else {
                console.error(`Invalid CO Key: ${coKey}`);
            }
        } else {
            console.error(`Invalid CO Mapped Value: ${coMapped}`);
        }

        // Update the marks obtained for the question
        student.event1[eventIndex].marksObtained = marks;

        // Save the updated student document
        await student.save();

        res.status(200).json({ message: 'Marks updated successfully' });
    } catch (error) {
        console.error('Error adding marks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/event2/addMarks', async (req, res) => {
    try {
        // Extract student ID, question number, and marks obtained from the request body
        const { studentId, questionNumber, marks } = req.body;

        // Find the student document by ID
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the index of the question in the event2 array
        const eventIndex = questionNumber - 1;

        // Check if the calculated index is out of bounds
        if (eventIndex < 0 || eventIndex >= student.event2.length) {
            return res.status(404).json({ message: 'Question not found for the student' });
        }

        // Subtract the previous marks from the corresponding CO in the scores object
        const coMapped = student.event2[eventIndex].coMapped;

        // Logging values to debug
        console.log(`Updating marks for Student: ${student.name}, CO Mapped: ${coMapped}`);
        console.log(`Current Scores: ${JSON.stringify(student.scores)}`);

        // Previous marks
        const prevMarks = student.event2[eventIndex].marksObtained;

        // Check if coMapped is within valid range (1-5)
        if (coMapped >= 1 && coMapped <= 5) {
            const coKey = `co${coMapped}`;
            console.log(`CO Key: ${coKey}`);
            
            // Adjust the scores for the mapped CO
            if (student.scores[coKey] !== undefined) {
                student.scores[coKey] += (marks - prevMarks);
                console.log(`Updated Scores: ${JSON.stringify(student.scores)}`);
            } else {
                console.error(`Invalid CO Key: ${coKey}`);
            }
        } else {
            console.error(`Invalid CO Mapped Value: ${coMapped}`);
        }

        // Update the marks obtained for the question
        student.event2[eventIndex].marksObtained = marks;

        // Save the updated student document
        await student.save();

        res.status(200).json({ message: 'Marks updated successfully' });
    } catch (error) {
        console.error('Error adding marks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/event3/addMarks', async (req, res) => {
    try {
        // Extract student ID, question number, and marks obtained from the request body
        const { studentId, questionNumber, marks } = req.body;

        // Find the student document by ID
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the index of the question in the event3 array
        const eventIndex = questionNumber - 1;

        // Check if the calculated index is out of bounds
        if (eventIndex < 0 || eventIndex >= student.event3.length) {
            return res.status(404).json({ message: 'Question not found for the student' });
        }

        // Subtract the previous marks from the corresponding CO in the scores object
        const coMapped = student.event3[eventIndex].coMapped;

        // Logging values to debug
        console.log(`Updating marks for Student: ${student.name}, CO Mapped: ${coMapped}`);
        console.log(`Current Scores: ${JSON.stringify(student.scores)}`);

        // Previous marks
        const prevMarks = student.event3[eventIndex].marksObtained;

        // Check if coMapped is within valid range (1-5)
        if (coMapped >= 1 && coMapped <= 5) {
            const coKey = `co${coMapped}`;
            console.log(`CO Key: ${coKey}`);
            
            // Adjust the scores for the mapped CO
            if (student.scores[coKey] !== undefined) {
                student.scores[coKey] += (marks - prevMarks);
                console.log(`Updated Scores: ${JSON.stringify(student.scores)}`);
            } else {
                console.error(`Invalid CO Key: ${coKey}`);
            }
        } else {
            console.error(`Invalid CO Mapped Value: ${coMapped}`);
        }

        // Update the marks obtained for the question
        student.event3[eventIndex].marksObtained = marks;

        // Save the updated student document
        await student.save();

        res.status(200).json({ message: 'Marks updated successfully' });
    } catch (error) {
        console.error('Error adding marks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/event4/addMarks', async (req, res) => {
    try {
        // Extract student ID, question number, and marks obtained from the request body
        const { studentId, questionNumber, marks } = req.body;

        // Find the student document by ID
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the index of the question in the event4 array
        const eventIndex = questionNumber - 1;

        // Check if the calculated index is out of bounds
        if (eventIndex < 0 || eventIndex >= student.event4.length) {
            return res.status(404).json({ message: 'Question not found for the student' });
        }

        // Subtract the previous marks from the corresponding CO in the scores object
        const coMapped = student.event4[eventIndex].coMapped;

        // Logging values to debug
        console.log(`Updating marks for Student: ${student.name}, CO Mapped: ${coMapped}`);
        console.log(`Current Scores: ${JSON.stringify(student.scores)}`);

        // Previous marks
        const prevMarks = student.event4[eventIndex].marksObtained;

        // Check if coMapped is within valid range (1-5)
        if (coMapped >= 1 && coMapped <= 5) {
            const coKey = `co${coMapped}`;
            console.log(`CO Key: ${coKey}`);
            
            // Adjust the scores for the mapped CO
            if (student.scores[coKey] !== undefined) {
                student.scores[coKey] += (marks - prevMarks);
                console.log(`Updated Scores: ${JSON.stringify(student.scores)}`);
            } else {
                console.error(`Invalid CO Key: ${coKey}`);
            }
        } else {
            console.error(`Invalid CO Mapped Value: ${coMapped}`);
        }

        // Update the marks obtained for the question
        student.event4[eventIndex].marksObtained = marks;

        // Save the updated student document
        await student.save();

        res.status(200).json({ message: 'Marks updated successfully' });
    } catch (error) {
        console.error('Error adding marks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/event5/addMarks', async (req, res) => {
    try {
        // Extract student ID, question number, and marks obtained from the request body
        const { studentId, questionNumber, marks } = req.body;

        // Find the student document by ID
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the index of the question in the event5 array
        const eventIndex = questionNumber - 1;

        // Check if the calculated index is out of bounds
        if (eventIndex < 0 || eventIndex >= student.event5.length) {
            return res.status(404).json({ message: 'Question not found for the student' });
        }

        // Subtract the previous marks from the corresponding CO in the scores object
        const coMapped = student.event5[eventIndex].coMapped;

        // Logging values to debug
        console.log(`Updating marks for Student: ${student.name}, CO Mapped: ${coMapped}`);
        console.log(`Current Scores: ${JSON.stringify(student.scores)}`);

        // Previous marks
        const prevMarks = student.event5[eventIndex].marksObtained;

        // Check if coMapped is within valid range (1-5)
        if (coMapped >= 1 && coMapped <= 5) {
            const coKey = `co${coMapped}`;
            console.log(`CO Key: ${coKey}`);
            
            // Adjust the scores for the mapped CO
            if (student.scores[coKey] !== undefined) {
                student.scores[coKey] += (marks - prevMarks);
                console.log(`Updated Scores: ${JSON.stringify(student.scores)}`);
            } else {
                console.error(`Invalid CO Key: ${coKey}`);
            }
        } else {
            console.error(`Invalid CO Mapped Value: ${coMapped}`);
        }

        // Update the marks obtained for the question
        student.event5[eventIndex].marksObtained = marks;

        // Save the updated student document
        await student.save();

        res.status(200).json({ message: 'Marks updated successfully' });
    } catch (error) {
        console.error('Error adding marks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;