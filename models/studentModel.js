const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  usn: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  scores: {
    co1: {
      type: Number,
      default: 0
    },
    co2: {
      type: Number,
      default: 0
    },
    co3: {
      type: Number,
      default: 0
    },
    co4: {
      type: Number,
      default: 0
    },
    co5: {
      type: Number,
      default: 0
    },
    maxco1: {
      type: Number,
      default: 0
    }, 
    maxco2: {
      type: Number,
      default: 0
    },
    maxco3: {
      type: Number,
      default: 0
    },
    maxco4: {
      type: Number,
      default: 0
    },
    maxco5: {
      type: Number,
      default: 0
    },
    
  },
  className: {
    type: String,
    required: true
  },
  event1: [{
    questionNumber: {
      type: Number,
      required: true
    },
    coMapped: {
      type: Number,
      required: true
    },
    marksObtained: {
      type: Number,
      default: 0
    }, 
    maxMarks: {
      type: Number,
      default: 0,
      required: true,
    }
  }],
  event2: [{
    questionNumber: {
      type: Number,
      required: true
    },
    coMapped: {
      type: Number,
      required: true
    },
    marksObtained: {
      type: Number,
      default: 0
    }, 
    maxMarks: {
      type: Number,
      default: 0,
      required: true,
    }
  }],
  event3: [{
    questionNumber: {
      type: Number,
      required: true
    },
    coMapped: {
      type: Number,
      required: true
    },
    marksObtained: {
      type: Number,
      default: 0
    }, 
    maxMarks: {
      type: Number,
      default: 0,
      required: true,
    }
  }],
  event4: [{
    questionNumber: {
      type: Number,
      required: true
    },
    coMapped: {
      type: Number,
      required: true
    },
    marksObtained: {
      type: Number,
      default: 0
    }, 
    maxMarks: {
      type: Number,
      default: 0,
      required: true,
    }
  }],
  event5: [{
    questionNumber: {
      type: Number,
      required: true
    },
    coMapped: {
      type: Number,
      required: true
    },
    marksObtained: {
      type: Number,
      default: 0
    }, 
    maxMarks: {
      type: Number,
      default: 0,
      required: true,
    }
  }]
});

studentSchema.index({ userName: 1, className: 1, usn: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;