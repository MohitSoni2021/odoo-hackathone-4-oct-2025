const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Please provide country'],
    },
    currency: {
      type: String,
      required: [true, 'Please provide currency'],
      default: 'USD',
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Company must have an admin'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);

module.exports = Company;