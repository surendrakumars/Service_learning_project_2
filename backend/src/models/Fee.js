const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models && mongoose.models.Fee
  ? mongoose.models.Fee
  : mongoose.model('Fee', FeeSchema);
