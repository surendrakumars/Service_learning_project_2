const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    grade: { type: String, default: null },
    father_name: { type: String, required: true, trim: true },
    mother_name: { type: String, required: true, trim: true },
    mobile_no: { type: String, required: true, trim: true },
    fees_paid: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models && mongoose.models.Student
  ? mongoose.models.Student
  : mongoose.model('Student', StudentSchema);
