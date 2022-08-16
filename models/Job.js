const mongoose = require("mongoose")
const JobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide comany name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    status: {
      type: String,
      required: [true, "Please provide status"],
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    interviewDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Job", JobSchema)
