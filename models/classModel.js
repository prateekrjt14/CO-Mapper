const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  professorUserName: {
    type: String,
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  className: {
    type: String,
    required: true
  }
});

// Define a compound index on professorUserName and className
classSchema.index({ professorUserName: 1, className: 1 }, { unique: true });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
