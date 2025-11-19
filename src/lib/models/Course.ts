import mongoose, { Schema, models } from "mongoose";

const CourseSchema = new Schema({
  title: String,
  description: String,
  teacher: { type: Schema.Types.ObjectId, ref: "User" },
  students: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export default models.Course || mongoose.model("Course", CourseSchema);
