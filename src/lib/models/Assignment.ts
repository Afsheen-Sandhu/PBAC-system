import mongoose, { Schema, models } from "mongoose";

const AssignmentSchema = new Schema({
  title: String,
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  student: { type: Schema.Types.ObjectId, ref: "User" },

  submission: String,
  grade: Number
});

export default models.Assignment || mongoose.model("Assignment", AssignmentSchema);
