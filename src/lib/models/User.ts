import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: { type: Schema.Types.ObjectId, ref: "Role", required: false },
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
});

const User = models.User || model("User", userSchema);
export default User;
