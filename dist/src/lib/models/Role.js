"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var roleSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
    // link permissions dynamically
    permissions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Permission" }],
});
var Role = mongoose_1.models.Role || (0, mongoose_1.model)("Role", roleSchema);
exports.default = Role;
