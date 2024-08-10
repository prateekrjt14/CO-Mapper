# CO Mapper

## Overview

CO Mapper is a web-based application designed to simplify the process of evaluating student performance against Course Outcomes (COs) in educational institutions. Traditionally, teachers manually check blue books and map them to specific COs before calculating and displaying the final Continuous Internal Evaluation (CIE) scores. This process is not only time-consuming but also prone to human error.

With CO Mapper, teachers can streamline this process by utilizing a user-friendly interface to manage their classes, map assessments to COs, and automatically generate detailed reports. The application reduces manual work, increases accuracy, and saves valuable time for educators.

## Features

### Teacher Management
- **Login/Signup:** Teachers can create accounts or log in to access their dashboard.
- **Class Management:** Teachers can add and manage classes they are responsible for.

### Event Management
- **Assessment Events:** For each class, teachers can manage up to 5 assessment events.
- **CO Mapping:** Teachers can add question numbers, marks obtained, and map them to specific COs for each event.

### Reporting
- **CO Performance:** The application calculates and displays the marks scored in each CO along with the percentage achieved.
- **Total CO Marks:** Teachers can view the total marks obtained in each CO, allowing for easy comparison and analysis.

## Models

### Class Model
The Class model represents the different classes that teachers manage. It includes information about the class name, the associated professor, and the students enrolled in the class.

### Professor Model
The Professor model handles the authentication and profile information of the teachers using the application. It stores details such as name, email, password, and the classes they manage.

### Student Model
The Student model contains information about the students in each class, including their names, roll numbers, and the marks obtained in various assessment events.

## Views

### Login/Signup
- **Authentication Views:** Pages for teachers to sign up for a new account or log in to an existing one.

### Homepage
- **Dashboard View:** A central hub where teachers can view and manage their classes, events, and reports.

### Events
- **Event Management View:** An interface for managing assessment events, mapping questions to COs, and inputting marks.

### Final List
- **Reporting View:** A summary of the performance metrics for each CO, including the final CIE scores.

## Tech Stack

- **MongoDB Atlas:** A cloud-based NoSQL database for storing user information, classes, students, and event data.
- **Node.js:** A JavaScript runtime used for building the server-side logic of the application.
- **Express.js:** A web application framework for Node.js, used to create the API endpoints and handle routing.
- **HTML/CSS:** Markup and styling languages used to create the front-end interface.
- **AJAX:** Asynchronous JavaScript and XML, used for making dynamic, real-time updates to the user interface without reloading the page.

## Getting Started

### Prerequisites
- Node.js installed on your local machine.
- MongoDB Atlas account for database hosting.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prateekrjt14/CO-Mapper.git
   cd CO-Mapper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file and add your MongoDB Atlas connection string, along with other necessary environment variables.

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to start using CO Mapper.

## Usage

1. **Sign up** as a teacher and log in to your account.
2. **Add your classes** and manage the students enrolled in each class.
3. **Create and manage events** for assessments, and map each question to a specific CO.
4. **View the reports** to analyze the performance of students against the defined COs.

![Screenshot 2024-08-10 225726](https://github.com/user-attachments/assets/46dc533b-b5a3-4376-b6b2-ccbdd7a46e2c)

![Screenshot 2024-08-10 225734](https://github.com/user-attachments/assets/c5d90f2a-6af1-494b-bc1c-6a9114ad0753)

![Screenshot 2024-08-10 225745](https://github.com/user-attachments/assets/eb286bcd-21d0-4a4e-8e16-295ef547793e)

![Screenshot 2024-08-10 225830](https://github.com/user-attachments/assets/9bd48fbd-7318-4181-a8c8-b32a59635ee8)

![Screenshot 2024-08-10 225857](https://github.com/user-attachments/assets/342ebde6-3560-4e51-a805-f2d2fb8deda3)

![Screenshot 2024-08-10 225921](https://github.com/user-attachments/assets/a9188024-05b2-4ae7-9658-5296fa1d4f94)
