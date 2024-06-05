const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    professorName: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    class: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
    }
  });
  

const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;
