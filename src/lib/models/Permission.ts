import mongoose, { Schema, model, models } from "mongoose";

const permissionSchema = new Schema({
  name: { type: String, required: true },
  description: String,
});

const Permission = models.Permission || model("Permission", permissionSchema);
export default Permission;
