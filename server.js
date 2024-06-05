const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const methodOverride = require('method-override');

const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const classRoutes = require('./routes/classRoutes'); // Import the classRoutes

const Professor = require('./models/professorModel');
const Class = require('./models/classModel');
const Student = require('./models/studentModel');
const app = express();

// MongoDB Atlas connection string
const dbConnectionURL = 'enter your connection url to any cloud based nrdbms like mongodb atlas'

// Connect to MongoDB Atlas
mongoose.connect(dbConnectionURL)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory
app.set("view engine", "ejs"); // setting up the view engine as 'ejs'
// Method override middleware
app.use(methodOverride('_method'));

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

const PORT = process.env.PORT || 3000;

// Routes
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use(classRoutes); // Use the classRoutes

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Route to render homepage
app.get('/homepage', async (req, res) => {
  try {
      // Fetch professor details using session userName
      const professor = await Professor.findOne({ userName: req.session.userName }).populate('class');

      if (!professor) {
          console.error('Professor not found');
          return res.status(404).send('Professor not found');
      }

      // Check if professor has classes
      if (!professor.class) {
          console.error('No classes found for professor');
          return res.status(404).send('No classes found for professor');
      }

      // Extract classes associated with the professor
      const classes = professor.class;

      // Retrieve class details (className and number of students) for each class
      const classDetails = await Promise.all(classes.map(async (cls) => {
          const numberOfStudents = await Class.findById(cls._id).populate('students');
          return {
              className: cls.className,
              numberOfStudents: numberOfStudents.students.length
          };
      }));

      // Render homepage template with class details
      res.render('homepage', { professorName: professor.professorName, userName: req.session.userName, classDetails });
  } catch (error) {
      console.error('Error fetching class details:', error);
      res.status(500).send('Error fetching class details');
  }
});

app.get('/chooseEvents/:className', (req, res) => {
  // Get professorName and userName from the session
  const professorName = req.session.professorName;
  const userName = req.session.userName;

  // Get the class name from the route parameter
  const className = req.params.className;

  // Store the className in the session
  req.session.className = className;

  // Render chooseEvents.ejs and pass the necessary values
  res.render('chooseEvents', { professorName, userName, className });
});

app.get('/event1', async (req, res) => {
  try {
    // Retrieve professor username, name, and class name from session
    const professorUserName = req.session.userName;
    const professorName = req.session.professorName;
    const className = req.session.className;

    // Find the class document
    const classDoc = await Class.findOne({ professorUserName, className });

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Get the students associated with the class
    const students = await Student.find({ _id: { $in: classDoc.students } });

    // Collect mapped questions for each student
    const mappedQuestions = students.map(student => ({
      studentName: student.name,
      rollNo: student.rollNo,
      usn: student.usn,
      mappedQuestions: student.event1,
      studentId: student._id
    }));

    // Collect mapped questions info for the first student
    const firstStudent = students[0]; // Assuming at least one student exists
    const mappedQuestionsInfo = firstStudent ? firstStudent.event1 : [];

    // Render event1.ejs and pass the necessary values
    res.render('event1', { professorName, userName: professorUserName, className, mappedQuestions, mappedQuestionsInfo });
  } catch (error) {
    console.error('Error fetching mapped questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/event2', async (req, res) => {
  try {
    // Retrieve professor username, name, and class name from session
    const professorUserName = req.session.userName;
    const professorName = req.session.professorName;
    const className = req.session.className;

    // Find the class document
    const classDoc = await Class.findOne({ professorUserName, className });

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Get the students associated with the class
    const students = await Student.find({ _id: { $in: classDoc.students } });

    // Collect mapped questions for each student
    const mappedQuestions = students.map(student => ({
      studentName: student.name,
      rollNo: student.rollNo,
      usn: student.usn,
      mappedQuestions: student.event2, // Change to event2
      studentId: student._id
    }));

    // Collect mapped questions info for the first student
    const firstStudent = students[0]; // Assuming at least one student exists
    const mappedQuestionsInfo = firstStudent ? firstStudent.event2 : []; // Change to event2

    // Render event2.ejs and pass the necessary values
    res.render('event2', { professorName, userName: professorUserName, className, mappedQuestions, mappedQuestionsInfo });
  } catch (error) {
    console.error('Error fetching mapped questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/event3', async (req, res) => {
  try {
    // Retrieve professor username, name, and class name from session
    const professorUserName = req.session.userName;
    const professorName = req.session.professorName;
    const className = req.session.className;

    // Find the class document
    const classDoc = await Class.findOne({ professorUserName, className });

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Get the students associated with the class
    const students = await Student.find({ _id: { $in: classDoc.students } });

    // Collect mapped questions for each student
    const mappedQuestions = students.map(student => ({
      studentName: student.name,
      rollNo: student.rollNo,
      usn: student.usn,
      mappedQuestions: student.event3, // Change to event3
      studentId: student._id
    }));

    // Collect mapped questions info for the first student
    const firstStudent = students[0]; // Assuming at least one student exists
    const mappedQuestionsInfo = firstStudent ? firstStudent.event3 : []; // Change to event3

    // Render event3.ejs and pass the necessary values
    res.render('event3', { professorName, userName: professorUserName, className, mappedQuestions, mappedQuestionsInfo });
  } catch (error) {
    console.error('Error fetching mapped questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/event4', async (req, res) => {
  try {
    // Retrieve professor username, name, and class name from session
    const professorUserName = req.session.userName;
    const professorName = req.session.professorName;
    const className = req.session.className;

    // Find the class document
    const classDoc = await Class.findOne({ professorUserName, className });

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Get the students associated with the class
    const students = await Student.find({ _id: { $in: classDoc.students } });

    // Collect mapped questions for each student
    const mappedQuestions = students.map(student => ({
      studentName: student.name,
      rollNo: student.rollNo,
      usn: student.usn,
      mappedQuestions: student.event4, // Change to event4
      studentId: student._id
    }));

    // Collect mapped questions info for the first student
    const firstStudent = students[0]; // Assuming at least one student exists
    const mappedQuestionsInfo = firstStudent ? firstStudent.event4 : []; // Change to event4

    // Render event4.ejs and pass the necessary values
    res.render('event4', { professorName, userName: professorUserName, className, mappedQuestions, mappedQuestionsInfo });
  } catch (error) {
    console.error('Error fetching mapped questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/event5', async (req, res) => {
  try {
    // Retrieve professor username, name, and class name from session
    const professorUserName = req.session.userName;
    const professorName = req.session.professorName;
    const className = req.session.className;

    // Find the class document
    const classDoc = await Class.findOne({ professorUserName, className });

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Get the students associated with the class
    const students = await Student.find({ _id: { $in: classDoc.students } });

    // Collect mapped questions for each student
    const mappedQuestions = students.map(student => ({
      studentName: student.name,
      rollNo: student.rollNo,
      usn: student.usn,
      mappedQuestions: student.event5, // Change to event5
      studentId: student._id
    }));

    // Collect mapped questions info for the first student
    const firstStudent = students[0]; // Assuming at least one student exists
    const mappedQuestionsInfo = firstStudent ? firstStudent.event5 : []; // Change to event5

    // Render event5.ejs and pass the necessary values
    res.render('event5', { professorName, userName: professorUserName, className, mappedQuestions, mappedQuestionsInfo });
  } catch (error) {
    console.error('Error fetching mapped questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/finalList', async (req, res) => {
  try {
    // Retrieve professor username, name, and class name from session
    const professorUserName = req.session.userName;
    const professorName = req.session.professorName;
    const className = req.session.className;

    // Find the class document
    const classDoc = await Class.findOne({ professorUserName, className });

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Get the students associated with the class
    const students = await Student.find({ _id: { $in: classDoc.students } });

    // Prepare data for final list
    const finalList = students.map(student => {
      // Helper function to calculate CO percentage
      const calculateCOPercentage = (coScore, maxCoScore) => {
        if (coScore === 0 || maxCoScore === 0) {
          return 0;
        }
        return ((coScore / maxCoScore) * 100).toFixed(2);
      };

      // Calculate final score by summing up co1 to co5
      const finalScore = student.scores.co1 + student.scores.co2 + student.scores.co3 + student.scores.co4 + student.scores.co5;

      return {
        studentName: student.name,
        rollNo: student.rollNo,
        usn: student.usn,
        co1: student.scores.co1,
        co2: student.scores.co2,
        co3: student.scores.co3,
        co4: student.scores.co4,
        co5: student.scores.co5,
        maxco1: student.scores.maxco1,
        maxco2: student.scores.maxco2,
        maxco3: student.scores.maxco3,
        maxco4: student.scores.maxco4,
        maxco5: student.scores.maxco5,
        co1Percentage: calculateCOPercentage(student.scores.co1, student.scores.maxco1),
        co2Percentage: calculateCOPercentage(student.scores.co2, student.scores.maxco2),
        co3Percentage: calculateCOPercentage(student.scores.co3, student.scores.maxco3),
        co4Percentage: calculateCOPercentage(student.scores.co4, student.scores.maxco4),
        co5Percentage: calculateCOPercentage(student.scores.co5, student.scores.maxco5),
        finalScore: finalScore
      };
    });

    // Render the finalList.ejs template with the prepared data
    res.render('finalList', { professorName, className, finalList });
  } catch (error) {
    console.error('Error fetching final list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});