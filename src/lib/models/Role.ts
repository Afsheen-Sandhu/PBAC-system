import mongoose, { Schema, model, models } from "mongoose";

const roleSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  // link permissions dynamically
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
});

const Role = models.Role || model("Role", roleSchema);
export default Role;
