import mongoose, { Schema, model, models } from "mongoose";

export interface IPermission {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
}

const permissionSchema = new Schema({
  name: { type: String, required: true },
  description: String,
});

const Permission = models.Permission || model("Permission", permissionSchema);
export default Permission;
